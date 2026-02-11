// routes/AssemblyAi.js
import express from "express";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { AssemblyAI } from "assemblyai";

dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

const ASSEMBLY_API_KEY = "a29dc7ab95814364849673964041e42b";
if (!ASSEMBLY_API_KEY) {
  console.warn("Warning: ASSEMBLY_API_KEY not set in .env");
}

/* ---------- File Upload Transcription (keeps your current flow) ---------- */
async function uploadToAssemblyAI(filePath) {
  const audioData = fs.readFileSync(filePath);
  const uploadResp = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: { authorization: ASSEMBLY_API_KEY },
    body: audioData
  });
  const uploadData = await uploadResp.json();
  return uploadData.upload_url;
}

async function startTranscription(audioUrl) {
  const resp = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      authorization: ASSEMBLY_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      speech_model: "universal"
    })
  });
  return resp.json();
}

async function pollTranscription(id) {
  while (true) {
    const resp = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: { authorization: ASSEMBLY_API_KEY }
    });
    const data = await resp.json();
    if (data.status === "completed") return data.text;
    if (data.status === "error") return "[Error]";
    await new Promise(r => setTimeout(r, 500));
  }
}

// POST: Upload audio and get transcription
router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const audioUrl = await uploadToAssemblyAI(filePath);
    const transcriptJob = await startTranscription(audioUrl);
    const text = await pollTranscription(transcriptJob.id);

    fs.unlinkSync(filePath); // cleanup
    res.json({ text });
  } catch (error) {
    console.error("❌ Transcription failed:", error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

export default router;