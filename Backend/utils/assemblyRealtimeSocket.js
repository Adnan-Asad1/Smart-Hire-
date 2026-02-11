import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function getRealtimeToken(req, res) {
  try {
    const response = await axios.get(
      "https://streaming.assemblyai.com/v3/token",
      {
        headers: {
          authorization: "a29dc7ab95814364849673964041e42b", // 👈 Your real API key here
        },
        params: {
          expires_in_seconds: 300, // token valid for 1 minute
        },
      }
    );

    res.json(response.data); // { "token": "....", "expires_at": ... }
  } catch (error) {
    console.error("Error generating realtime token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create token" });
  }
}
