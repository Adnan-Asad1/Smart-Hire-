// routes/interview.js

import express from 'express';
import { Interview } from '../models/Interview.js';
import { generateAIQuestions } from '../utils/groq.js'; // 🔄 Now using Groq
import { v4 as uuidv4 } from 'uuid';
import authMiddleware from '../middleware/auth.js';
import { Conversation } from "../models/Conversation.js";
import { generateInterviewReport } from "../utils/groq.js";
import { Feedback } from "../models/Feedback.js";
import { User } from '../models/userModel.js'
const router = express.Router();

// Temporary in-memory store
const tempInterviewStore = {};

// Prompt builder function
function createPrompt(jobPosition, jobDescription, duration, types, numQuestions = 10) {
  const typeStr = types.join(', ');
  return `
Generate ${numQuestions} unique and relevant interview questions.
Job Position: ${jobPosition}
Job Description: ${jobDescription}
Interview Types: ${typeStr}
Interview Duration: ${duration} minutes.

Distribute the questions across the selected types, include a short label with each question (e.g., [Technical], [Behavioral]).
Only return the list of questions in numbered format.
`;
}

// 1️⃣ Generate questions and save to memory
router.post('/generate-only', authMiddleware, async (req, res) => {
  const { jobPosition, jobDescription, duration, types, numQuestions } = req.body;

  try {
    // ✅ Step 1: Fetch logged-in user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // ✅ Step 2: Check credits
    if (user.credits <= 0) {
      return res.status(400).json({
        success: false,
        error: "No credits left. Please purchase more to create an interview.",
      });
    }

    // ✅ Step 3: Generate questions (only if credits available)
    const prompt = createPrompt(jobPosition, jobDescription, duration, types, numQuestions);
    const questions = await generateAIQuestions(prompt);

    const tempId = uuidv4();
    tempInterviewStore[tempId] = {
      jobPosition,
      jobDescription,
      duration,
      types,
      questions,
    };

    res.status(200).json({ success: true, questions, tempId });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ success: false, error: 'AI generation failed' });
  }
});



// 2️⃣ Save interview from memory to DB
// Save interview with logged-in user
router.post('/create', authMiddleware, async (req, res) => {
  const { tempId, questions } = req.body;
  const userId = req.user.id;

  const interviewData = tempInterviewStore[tempId];
  if (!interviewData) {
    return res.status(400).json({ success: false, error: 'Invalid or expired tempId' });
  }

  try {
    // 1️⃣ Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 2️⃣ Check credits before saving
    if (user.credits <= 0) {
      return res.status(400).json({
        success: false,
        error: "No credits left. Please purchase more to create an interview.",
      });
    }

    // 3️⃣ Apply custom questions if passed
    if (Array.isArray(questions) && questions.length > 0) {
      interviewData.questions = questions;
    }

    // 4️⃣ Save interview
    const interview = await Interview.create({
      ...interviewData,
      user: userId,
    });

    // 5️⃣ Deduct one credit
    user.credits -= 1;
    await user.save();

    // 6️⃣ Clear temp data
    delete tempInterviewStore[tempId];

    res.status(201).json({
      success: true,
      message: 'Interview saved successfully & 1 credit deducted',
      interviewId: interview._id,
      remainingCredits: user.credits, // 👈 frontend me dikhane ke liye
    });
  } catch (error) {
    console.error('DB Save Error:', error);
    res.status(500).json({ success: false, error: 'Failed to save interview' });
  }
});

// 📌 Get all interviews of logged-in user
router.get("/GetInterviews", authMiddleware, async (req, res) => {
  try {
    // ✅ Fetch only the interviews created by the logged-in user
    const interviews = await Interview.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Fetch User Interviews Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch interviews" });
  }
});
// 📌 Get latest maximum three interviews of logged-in user
router.get("/GetLatestThree", authMiddleware, async (req, res) => {
  try {
    const latestInterviews = await Interview.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // newest first
      .limit(3); // only 3 max

    res.status(200).json({
      success: true,
      count: latestInterviews.length,
      interviews: latestInterviews,
    });
  } catch (error) {
    console.error("Fetch Latest Interviews Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch latest interviews" });
  }
});

// 📌 Get only conducted interviews (matched with Conversation.interviewId)
router.get("/GetConducted", authMiddleware, async (req, res) => {
  try {
    // Step 1: Fetch all interviewIds from Conversation
    const conductedConversations = await Conversation.find({}, "interviewId");

    // Extract only the interviewIds
    const conductedIds = conductedConversations.map(c => c.interviewId.toString());

    // Step 2: Fetch interviews of logged-in user where _id is in conductedIds
    const conductedInterviews = await Interview.find({
      user: req.user.id,
      _id: { $in: conductedIds }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: conductedInterviews.length,
      interviews: conductedInterviews,
    });
  } catch (error) {
    console.error("Fetch Conducted Interviews Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch conducted interviews" });
  }
});

router.get('/:interviewId', async (req, res) => {
  const { interviewId } = req.params;

  try {
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ success: false, error: 'Interview not found' });
    }

    res.status(200).json({ success: true, interview });
  } catch (error) {
    console.error('Fetch Interview Error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve interview' });
  }
});



// Check if interview already attempted
router.get("/:interviewId/check", async (req, res) => {
  const { interviewId } = req.params;

  try {
    const existing = await Conversation.findOne({ interviewId });

    if (existing) {
      return res.status(200).json({ success: false, message: "Already attempted" });
    }

    return res.status(200).json({ success: true, message: "Not attempted yet" });
  } catch (error) {
    console.error("Check Interview Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

router.put("/:id/urgent", async (req, res) => {
  try {
    const { urgent } = req.body;

    if (typeof urgent !== "boolean") {
      return res.status(400).json({ message: "Urgent must be true or false" });
    }

    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { urgent },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json({
      message: "Urgent status updated successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Get conversation by interviewId
router.get("/:interviewId/conversation", async (req, res) => {
  const { interviewId } = req.params;

  try {
    // Find conversation by interviewId
    const conversation = await Conversation.findOne({ interviewId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "No conversation found for this interviewId",
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Fetch Conversation Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch conversation",
    });
  }
});



router.get("/:interviewId/feedback", async (req, res) => {
  const { interviewId } = req.params;

  try {
    // ✅ Step 1: Check if feedback already exists
    let feedback = await Feedback.findOne({ interviewId });

    if (feedback) {
      return res.status(200).json({
        success: true,
        feedbackReport: feedback.aiReport,
        source: "database", // ✅ helpful for debugging
      });
    }

    // ✅ Step 2: If not in DB → fetch interview + conversation
    const interview = await Interview.findById(interviewId);
    const conversation = await Conversation.findOne({ interviewId });

    if (!interview || !conversation) {
      return res.status(404).json({
        success: false,
        message: "Interview or conversation not found",
      });
    }

    // ✅ Step 3: Call AI to generate report
    const report = await generateInterviewReport(interview, conversation);

    // ✅ Step 4: Save report in DB
    feedback = await Feedback.create({
      interviewId,
      aiReport: report,
    });

    res.status(200).json({
      success: true,
      feedbackReport: report,
      source: "ai", // ✅ helpful for debugging
    });
  } catch (error) {
    console.error("Feedback Report Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate feedback report",
    });
  }
});






// 📌 Get all interviews by a specific userId (for admin/HR)
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // ✅ Find all interviews created by this user
    const interviews = await Interview.find({ user: userId }).sort({ createdAt: -1 });

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No interviews found for this user",
      });
    }

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Fetch User Interviews (by Admin) Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch user interviews" });
  }
});



// 📌 Get interview details + check if conducted
router.get("/:interviewId/details", async (req, res) => {
  const { interviewId } = req.params;

  try {
    // Step 1: Get interview details
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // Step 2: Check if interview was conducted
    const conversation = await Conversation.findOne({ interviewId });

    if (conversation) {
      // ✅ Interview was conducted
      return res.status(200).json({
        success: true,
        interview,
        conducted: true,
        candidate: {
          name: conversation.candidateName,
          email: conversation.candidateEmail,
          date: conversation.createdAt, // ⬅️ date when conducted
        },
      });
    } else {
      // ❌ Interview not conducted yet
      return res.status(200).json({
        success: true,
        interview,
        conducted: false,
      });
    }
  } catch (error) {
    console.error("Fetch Interview Details Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch interview details",
    });
  }
});



// 📌 Get interview stats (total created + conducted) for a specific HR
router.get("/user/:userId/stats", async (req, res) => {
  const { userId } = req.params;

  try {
    // 1️⃣ Count all interviews created by this HR
    const totalInterviews = await Interview.countDocuments({ user: userId });

    // 2️⃣ Get all interview IDs created by this HR
    const hrInterviews = await Interview.find({ user: userId }, "_id");
    const interviewIds = hrInterviews.map(i => i._id.toString());

    // 3️⃣ Count how many conversations exist for these interviews
    const conductedCount = await Conversation.countDocuments({
      interviewId: { $in: interviewIds }
    });

    // 4️⃣ Calculate percentage (if needed)
    const conductedPercentage =
      totalInterviews > 0
        ? ((conductedCount / totalInterviews) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      success: true,
      hrId: userId,
      totalInterviews,
      conductedCount,
      conductedPercentage: `${conductedPercentage}%`,
    });
  } catch (error) {
    console.error("HR Interview Stats Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch HR interview stats",
    });
  }
});

// 📌 Get latest 2 interviews with HR name + job title
router.get("/latestWithUser/fetch", async (req, res) => {
  try {
    const recentInterviews = await Interview.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(2)
      .populate("user", "fullName"); // only fetch HR name

    if (!recentInterviews || recentInterviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No interviews found",
      });
    }

    // Format response
    const formatted = recentInterviews.map((interview) => ({
      hrName: interview.user?.fullName || "Unknown HR",
      jobTitle: interview.jobPosition,
      createdAt: interview.createdAt,
    }));

    res.status(200).json({
      success: true,
      interviews: formatted,
    });
  } catch (error) {
    console.error("Fetch Latest Interviews with User Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch interviews with HR info",
    });
  }
});


export default router;
