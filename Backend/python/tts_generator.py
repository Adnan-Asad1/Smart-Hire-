from gtts import gTTS
import sys

def generate_tts(text, filename="output.mp3"):
    tts = gTTS(text=text, lang='en')
    tts.save(filename)
    print(f"[OK] Audio saved as {filename}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        text = sys.argv[1]
        filename = sys.argv[2]
        generate_tts(text, filename)
    else:
        print("[❌] Please provide both text and filename as arguments.")
