// routes/interviewRoutes.js
import express from 'express';
import { startInterviewSession, conductInterview } from '../utils/groq.js';
import { Conversation } from '../models/Conversation.js';
const router = express.Router();

// Start session
// Start session
router.post('/start', (req, res) => {
  const { sessionId, questions } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId' });
  }

  // ✅ If session already exists, ignore questions and reuse
  const session = startInterviewSession(sessionId, questions || []);

  res.json({ message: 'Interview session ready', session });
});


// Conduct interview
router.post('/conduct', async (req, res) => {
  try {
    const { sessionId, userAnswer,time,candidateName,candidateEmail } = req.body;
    console.log(time)
    console.log(candidateName);
    console.log(candidateEmail);
    if (!sessionId || typeof userAnswer !== 'string') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const { aiResponse, currentQuestionIndex } = await conductInterview(sessionId, userAnswer);
    
 // 🔥 Check karo ke is sessionId ka document hai ya nahi
    let conversation = await Conversation.findOne({ interviewId: sessionId });

    if (!conversation) {
      // 🔥 Naya sessionId hai to naya document banao
      conversation = new Conversation({
        interviewId: sessionId,
        candidateName,
        candidateEmail,
        conversation: [
          {
            time,
            userText: userAnswer,
            aiText: aiResponse,
          },
        ],
      });
    } else {
      // 🔁 Agar sessionId pehle se hai to sirf append karo
      conversation.conversation.push({
        time,
        userText: userAnswer,
        aiText: aiResponse,
      });
    }

    await conversation.save();

    res.json({ aiResponse, currentQuestionIndex });
  } catch (error) {
    console.error("Interview error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});
export default router;