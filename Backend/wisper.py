#!/usr/bin/env python3
"""
realtime_faster_whisper.py
Near-real-time microphone -> text using faster-whisper.

How it works (short):
- Capture short audio frames from the microphone with sounddevice.
- Keep a rolling buffer (30s window) and feed overlapping chunks to the faster-whisper model
  in a background worker to avoid blocking the audio capture thread.
- Print the incremental transcript as results arrive.

NOTES:
- This implementation writes temporary WAV chunks for robust audio formatting compatibility
  (some users report directly passing numpy arrays to faster-whisper can be fragile).
- For lowest latency use a GPU with CUDA and a small model (see README notes below).
"""

import queue
import threading
import time
import tempfile
import os
import sys
from pathlib import Path
import numpy as np
import sounddevice as sd
import soundfile as sf
from faster_whisper import WhisperModel

# ------------------ USER CONFIG ------------------
MODEL_NAME = "small"         # choose: tiny / base / small / medium / large
DEVICE = "cuda"              # "cuda" (GPU) or "cpu"
SAMPLE_RATE = 16000          # Whisper expects 16 kHz
CHANNELS = 1
CHUNK_SECONDS = 3            # how many seconds per captured chunk (small for low latency)
WINDOW_SECONDS = 30          # sliding window fed to model (Whisper usually uses 30s windows)
OVERLAP_SECONDS = 1          # overlap between consecutive transcribe windows
BEAM_SIZE = 1                # lower -> faster, higher -> often slightly better accuracy
LANGUAGE = None              # e.g. "en" to force english; None to auto-detect
# -------------------------------------------------

assert CHUNK_SECONDS > 0 and WINDOW_SECONDS >= CHUNK_SECONDS

# queue for handing audio chunks to worker
audio_q = queue.Queue(maxsize=10)
# queue for sending transcription jobs (audio numpy arrays)
job_q = queue.Queue()

stop_event = threading.Event()

def audio_callback(indata, frames, time_info, status):
    """sounddevice callback runs in a separate thread supplied by sounddevice."""
    if status:
        # print status messages but don't raise
        print("Audio status:", status, file=sys.stderr)
    # Convert to mono float32 numpy array
    arr = indata.copy()
    if arr.ndim > 1:
        arr = arr.mean(axis=1)
    audio_q.put(arr)

def capture_thread():
    """Continuously capture short chunks and assemble into chunks of CHUNK_SECONDS."""
    chunk_frames = int(CHUNK_SECONDS * SAMPLE_RATE)
    buffer = np.zeros((0,), dtype=np.float32)
    try:
        with sd.InputStream(samplerate=SAMPLE_RATE, channels=CHANNELS, dtype='float32',
                            blocksize=0, callback=audio_callback):
            print("Recording... press Ctrl+C to stop.")
            while not stop_event.is_set():
                try:
                    # assemble enough frames to produce CHUNK_SECONDS
                    arr = audio_q.get(timeout=0.5)
                except queue.Empty:
                    continue
                buffer = np.concatenate((buffer, arr))
                while buffer.shape[0] >= chunk_frames:
                    chunk = buffer[:chunk_frames]
                    buffer = buffer[chunk_frames:]
                    # put chunk into job queue for sliding window assembly
                    job_q.put(("chunk", chunk))
    except KeyboardInterrupt:
        stop_event.set()
    except Exception as e:
        print("Capture error:", e, file=sys.stderr)
        stop_event.set()

def worker_thread(model: WhisperModel):
    """
    Build a sliding window from incoming chunks and run transcribe on each window.
    We use a small overlap to avoid missing words at boundaries.
    """
    window_frames = int(WINDOW_SECONDS * SAMPLE_RATE)
    overlap_frames = int(OVERLAP_SECONDS * SAMPLE_RATE)

    # rolling buffer
    rolling = np.zeros((0,), dtype=np.float32)
    last_printed = ""  # to avoid reprinting same text
    job_count = 0

    while not stop_event.is_set():
        try:
            tag, chunk = job_q.get(timeout=0.5)
        except queue.Empty:
            continue

        if tag == "chunk":
            # append and ensure rolling buffer isn't larger than WINDOW_SECONDS
            rolling = np.concatenate((rolling, chunk))
            if rolling.shape[0] > window_frames:
                # keep latest WINDOW_SECONDS of audio
                rolling = rolling[-window_frames:]

            # When the rolling buffer has at least WINDOW_SECONDS (or close),
            # run transcription on it to get near-live text.
            # We'll use a background thread for the heavy work to avoid blocking capture.
            if rolling.shape[0] >= int(WINDOW_SECONDS * SAMPLE_RATE) - (SAMPLE_RATE * CHUNK_SECONDS):
                # copy so the buffer can continue to be filled
                audio_for_transcribe = rolling.copy()
                job_count += 1
                threading.Thread(target=transcribe_job,
                                 args=(model, audio_for_transcribe, job_count, overlap_frames, LANGUAGE, BEAM_SIZE, lambda txt: print_transcript(txt, last_printed))).start()

def transcribe_job(model, audio_np, job_id, overlap_frames, language, beam_size, on_result):
    """
    Convert numpy array to temp WAV (16kHz mono), call model.transcribe,
    and call on_result(text).
    """
    # Normalize / clip - ensure in [-1,1]
    audio_np = np.asarray(audio_np, dtype=np.float32)
    maxv = max(1e-8, np.abs(audio_np).max())
    if maxv > 1.0:
        audio_np = audio_np / maxv

    # write temp wav
    tmpf = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    tmp_path = tmpf.name
    tmpf.close()
    try:
        sf.write(tmp_path, audio_np, SAMPLE_RATE, subtype='PCM_16')
        # call faster-whisper transcribe; return segments + info
        # we use no_timestamps and beam_size small for speed.
        # language param can be provided to avoid auto-detect latency.
        result = model.transcribe(tmp_path, beam_size=beam_size, language=language)
        # result -> (segments, info)
        segments, info = result
        text = " ".join([s.text for s in segments]).strip()
        on_result(text)
    except Exception as e:
        print(f"[job {job_id}] Transcribe error:", e, file=sys.stderr)
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

def print_transcript(new_text, last_text_ref):
    """
    Pretty-print incremental transcript. We avoid reprinting duplicates by simple compare.
    """
    # In this simple implementation just print the latest result.
    # A more complex approach would diff previous text and print only newly spoken words.
    print("\n[TRANSCRIPT UPDATE]")
    print(new_text)
    print("--------------------------------------------------")

def main():
    # Load model
    print(f"Loading model '{MODEL_NAME}' on device '{DEVICE}' ... (this may take a while)")
    model = WhisperModel(MODEL_NAME, device=DEVICE, compute_type="float16" if DEVICE.startswith("cuda") else "int8")
    print("Model loaded.")

    cap_thread = threading.Thread(target=capture_thread, daemon=True)
    work_thread = threading.Thread(target=worker_thread, args=(model,), daemon=True)

    cap_thread.start()
    work_thread.start()

    try:
        while not stop_event.is_set():
            time.sleep(0.3)
    except KeyboardInterrupt:
        print("Stopping...")
        stop_event.set()

    cap_thread.join(timeout=1.0)
    work_thread.join(timeout=1.0)
    print("Exited.")

if __name__ == "__main__":
    main()
 
