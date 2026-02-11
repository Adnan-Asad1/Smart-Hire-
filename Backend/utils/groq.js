// utils/groq.js
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Employee } from "../models/Employee.js";
dotenv.config();

const groq = new Groq({
  apiKey: "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",
});

export const generateAIQuestions = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    return responseText
      .split('\n')
      .map(q => q.trim())
      .filter(q => q !== '');
  } catch (error) {
    console.error('Groq SDK Error:', error.response?.data || error.message);
    throw new Error('Failed to generate questions using Groq');
  }
};
export const analyzeResume = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq Resume Analysis Error:', error.response?.data || error.message);
    throw new Error('Failed to analyze resume using Groq');
  }
};

const interviewSessions = {};

/**
 * Start a new interview session, or return existing one if already started
 */
export const startInterviewSession = (sessionId, questions) => {
  // ✅ If session already exists, just return it (don’t reset)
  if (interviewSessions[sessionId]) {
    return interviewSessions[sessionId];
  }

  // ✅ Only create new session the first time
  interviewSessions[sessionId] = {
    questions,
    currentQuestionIndex: 0,
    ended: false
  };
  return interviewSessions[sessionId];
};


/**
 * Conduct an interview step (only gives AI the current question)
 */
export const conductInterview = async (sessionId, userAnswer) => {
  try {
    const session = interviewSessions[sessionId];
    if (!session) {
      throw new Error('Interview session not found. Please start a session first.');
    }

    let { questions, currentQuestionIndex, ended } = session;

    // End check
    if (ended || currentQuestionIndex >= questions.length) {
      session.ended = true;
      return {
        aiResponse: "Thank you for your time today! This concludes our interview. We’ll be in touch soon.",
        currentQuestionIndex
      };
    }

    const currentQuestion = questions[currentQuestionIndex];
const nextQuestion = currentQuestionIndex + 1 < questions.length 
  ? questions[currentQuestionIndex + 1] 
  : null;

    // AI only sees the current question
    const prompt = `
You are an AI interviewer. You are currently on Question ${currentQuestionIndex + 1} of the interview.

Current Question: "${currentQuestion}"
${nextQuestion ? `Next Question: "${nextQuestion}"` : ''}

User just said: "${userAnswer}"
Rules:

- Speak naturally like a human interviewer.
- Do NOT reveal that you have a predefined question list.
- If user greets casually (hi, hello, etc.) → greet back warmly and keep them on the same question (do NOT advance).
- If user asks to "repeat" → repeat the current question *not exactly word-for-word* from the list (use rephrasing).
- If user says "don't know" or similar → encourage them positively, then ask if they want to repeat or move on.
- If user says "move on" or similar → go to next question.
- If user gives a valid answer → acknowledge positively, then reword the *next* question in your own words (paraphrase), keeping its meaning intact.
- While paraphrasing, never include metadata like [technical] or [behavioural] in your spoken text — that is for your reference only.
- When you paraphrase, avoid reading it exactly from the list. Use synonyms, conversational tone, and natural flow so it sounds improvised but keeps the same intent.
- If at the last question and answered → wrap up politely, thank them for their time, and do NOT ask more questions.
- Never skip questions unless the user explicitly says "move on".
- please make sure that the dont skip any question because sometime it skip the some questions and jump into the next question.Make sure that dont skip any question
- NEVER go back to any question it  that is already marked as done.
- If user explicitly asks to "go back" or mentions a previous question → politely refuse and tell them we must continue. Never repeat or rephrase any past question. Continue only from the current question or move forward.

At the end of your answer, append JSON metadata on a new line:
{"action": "stay" | "next"}
`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a friendly AI interviewer. Always follow the structured rules and include JSON metadata at the end.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    // Extract metadata
    const match = aiResponse.match(/\{.*\}$/);
    let cleanResponse = aiResponse;

    if (match) {
      try {
        const meta = JSON.parse(match[0]);

        if (meta.action === 'next') {
          // Only advance if answered (decided by AI)
          currentQuestionIndex++;

          if (currentQuestionIndex >= questions.length) {
            session.currentQuestionIndex = questions.length;
            session.ended = true;
            return {
              aiResponse: "Thank you for your time today! This concludes our interview. We’ll be in touch soon.",
              currentQuestionIndex: session.currentQuestionIndex
            };
          }
        }
        // stay → do nothing

        session.currentQuestionIndex = currentQuestionIndex;
        cleanResponse = aiResponse.replace(match[0], '').trim();
      } catch (err) {
        console.warn('Failed to parse AI metadata:', err);
      }
    }

    return {
      aiResponse: cleanResponse,
      currentQuestionIndex
    };

  } catch (error) {
    console.error('Groq Interview Error:', error.response?.data || error.message);
    throw new Error('Failed to conduct interview');
  }
};


// utils/groq.js

export const generateInterviewReport = async (interviewDetails, conversationDetails) => {
  try {
    const { jobPosition, jobDescription, duration, types, questions } = interviewDetails;
    const { candidateName, conversation } = conversationDetails;

    const prompt = `
You are an expert HR recruiter and interviewer. Generate a **professional interview evaluation report**.

Interview Details:
- Candidate Name: ${candidateName}
- Position Applied: ${jobPosition}
- Job Description: ${jobDescription}
- Interview Duration: ${duration} minutes
- Interview Type(s): ${types.join(", ")}
- Total Questions (Planned): ${questions.length}

Conversation Transcript (for your analysis only):
${conversation.map((c, i) => `AI: ${c.aiText}\nUser: ${c.userText}`).join("\n\n")}

⚠️ Strict Analysis Rules:
- Base the evaluation ONLY on the conversation transcript.
- Use the Planned Questions list as the ground truth (${questions.length} total).
- Identify which planned questions were actually asked in the conversation (even if rephrased).
- If a question was repeated casually, count it only once.
- For each planned question:
   • If the user gave a valid, relevant answer → mark as Attempted  
   • If the user gave no answer or an irrelevant response → mark as Skipped/Not Attempted
- In the "Attempt Summary", clearly show:
   • Total Planned Questions = ${questions.length}  
   • Actual Unique Questions Asked (from conversation)  
   • Attempted (valid answers)  
   • Skipped / Irrelevant / Not Attempted
- DO NOT invent or assume answers beyond the transcript.
- Generate evaluation and scoring only after analyzing this mapping.
- Evaluate and score(1–10) across these categories: 
  • Technical Knowledge
  • Problem-Solving Ability
  • Communication Skills
  • Confidence  (deduce from tone/phrasing)
  • Teamwork & Adaptability
  • Cultural Fit
Generate the report with the following fixed headings:
  **Interview Evaluation Report**
  **Candidate Information**
  **Attempt Summary**
  **Evaluation and Scoring**
  **Overall Performance Summary**
  **Strengths**
  **Areas for Improvement**
  **Final Recommendation**

Details:
Under the heading "Interview Evaluation Report", include 2–3 formal lines such as:"This report provides a comprehensive evaluation of the candidate’s performance during the interview.  
It is based strictly on the actual conversation and the relevance of the candidate’s responses.  
The aim is to assess the candidate’s overall suitability for the applied role."
- "Candidate Information" → candidate name, position, type, duration.
- "Attempt Summary" → show Planned vs Actual Unique vs Attempted vs Skipped.
- "Evaluation and Scoring" → rate 1–10 for: Technical Knowledge, Problem-Solving Ability, Communication Skills, Confidence / Body Language, Teamwork & Adaptability, Cultural Fit.
- "Overall Performance Summary" → 1–2 short paragraphs.
- "Strengths" / "Areas for Improvement" → bullet points.
- "Final Recommendation" → Hire / Consider / Not Hire with reasoning.
- Keep the style formal, concise, professional.
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 1200,
    });

    return completion.choices[0]?.message?.content || "No report generated.";
  } catch (error) {
    console.error("Groq Report Generation Error:", error);
    throw new Error("Failed to generate interview report");
  }
};



export const recommendProjectTeam = async (req, res) => {
  try {
    const { 
      projectTitle, 
      projectDescription, 
      projectDuration, 
      requiredSkills, 
      teamSize, 
      experienceLevel, 
      budget 
    } = req.body;

    if (!projectTitle || !projectDescription || !projectDuration || !requiredSkills || !teamSize || !experienceLevel) {
      return res.status(400).json({ message: "Missing required project fields" });
    }

    // Normalize requiredSkills
    const skillsArr = Array.isArray(requiredSkills)
      ? requiredSkills
      : String(requiredSkills).split(",").map(s => s.trim()).filter(Boolean);

    // Fetch employees from DB
    const employees = await Employee.find({}, { password: 0, __v: 0 });

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees available" });
    }

    // Adjust teamSize if HR request > available employees
    let adjustedTeamSize = teamSize;
    let note = "";
    if (teamSize > employees.length) {
      adjustedTeamSize = employees.length;
      note = `⚠️ Requested team size (${teamSize}) is greater than available employees (${employees.length}). Recommendation is based only on available employees.`;
    }

    // Build AI prompt
    const prompt = `
You are an **expert HR recruiter and project manager**.  
Your task is to recommend the **best project team** from the given list of employees.  
⚠️ Do not invent or assume hypothetical employees — only choose from the provided list.  

====================
📌 PROJECT DETAILS
====================
- Title: ${projectTitle}
- Description: ${projectDescription}
- Duration: ${projectDuration}
- Required Skills: ${skillsArr.join(", ")}
- Required Team Size: ${teamSize} (Adjusted: ${adjustedTeamSize})
- Experience Level: ${experienceLevel}
- Budget: ${budget || "Not specified"}

====================
👨‍💼 AVAILABLE EMPLOYEES
====================
${employees.map((emp, i) => 
  `${i+1}. 
   Name: ${emp.name}  
   Email: ${emp.email}  
   Designation: ${emp.designation}  
   Experience: ${emp.experience}  
   Skills: ${emp.skills.join(", ")}`  
).join("\n\n")}

====================
⚠️ RULES
====================
1. Select exactly **${adjustedTeamSize} employees** (not more, not less).  
2. Only choose from the employees listed above — never create new ones.  
3. Provide explanation under **"Why Selected"** for each chosen member.  
4. Provide a **Team Success Probability Score (0–100%)** under the heading **"Success Probability"**.  
5. For employees not selected, list them under **"Not Selected Employees"** and explain briefly why.  
6. Output must follow this structure:

====================
✅ SELECTED TEAM
====================
[List of chosen employees with reasons]

====================
🚫 NOT SELECTED EMPLOYEES
====================
[List of not chosen employees with reasons]

====================
📊 SUCCESS PROBABILITY
====================
[Provide score in percentage with short justification]
`;

    // Send to Groq AI
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1200,
    });

    let aiResponse = completion.choices[0]?.message?.content || "";

    // Wrap response
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (err) {
      parsed = { rawResponse: aiResponse };
    }

    return res.status(200).json({
      message: "Project team recommendation generated successfully",
      note: note, // ⚠️ Extra info for HR
      recommendation: parsed
    });

  } catch (error) {
    console.error("Team Recommendation Error:", error);
    return res.status(500).json({ message: "Failed to generate project team recommendation" });
  }
};
