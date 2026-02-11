import express from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import fs from 'fs';
import { analyzeResume } from '../utils/groq.js';
import { Interview } from '../models/Interview.js';
const router = express.Router();

// Ensure 'uploads' folder exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ✅ Combined OCR + AI analysis route
router.post('/analyze-resume', upload.single('resumeImage'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!req.file || !jobDescription) {
      return res.status(400).json({ success: false, error: 'Resume image and job description are required' });
    }

    // Extract text from image
    const imagePath = req.file.path;
    const { data: { text: resumeText } } = await Tesseract.recognize(imagePath, 'eng');
    
    fs.unlinkSync(imagePath); // clean up uploaded file

    // Generate prompt
    const analysisPrompt = `
Analyze the following resume and job description:

Resume:
${resumeText}

Job Description:
${jobDescription}

Now perform the following:
1. Extract the key skills from the resume.
2. Compare them with the job description.
3. Predict a score (out of 100) for how well the candidate will likely perform in an interview for this job.
4. List 5 strong areas based on the resume.
5. List 5 weak or missing areas.
6. Suggest 1 specific improvement tip for the candidate to improve their chances.

Respond in JSON format with:
{
  "score": number (0–100),
  "keySkills": [string],
  "strongAreas": [string],
  "weakAreas": [string],
  "improvementTip": string
}
`;

    const analysis = await analyzeResume(analysisPrompt);
    const cleaned = analysis;

    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);

    let result;
    try {
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      return res.status(500).json({ success: false, error: 'Invalid JSON from AI model' });
    }

    res.status(200).json({ success: true,  result });
  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze resume' });
  }
});


// ✅ Route: Get all interviews
router.get('/get-interviews', async (req, res) => {
  try {
    // Fetch all interviews from DB
    const interviews = await Interview.find()
      .populate('user', 'name email') // optional: show user info
      .sort({ createdAt: -1 }); // latest first

    // Send data to frontend
    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews from database',
    });
  }
});

export default router;
