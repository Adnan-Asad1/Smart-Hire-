
import { Employee } from "../models/Employee.js";
import { groq } from "../utils/groq.js";  // reuse Groq instance
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

    // Build AI prompt
    const prompt = `
You are an expert HR recruiter and project manager. 
Your task is to recommend the **best project team** from a list of employees.

Project Details:
- Title: ${projectTitle}
- Description: ${projectDescription}
- Duration: ${projectDuration}
- Required Skills: ${skillsArr.join(", ")}
- Team Size (required): ${teamSize}
- Experience Level: ${experienceLevel}
- Budget: ${budget || "Not specified"}

Available Employees (from database):
${employees.map((emp, i) => 
  `${i+1}. Name: ${emp.name}, Email: ${emp.email}, Designation: ${emp.designation}, Experience: ${emp.experience}, Skills: ${emp.skills.join(", ")}`
).join("\n")}

⚠️ Rules:
1. Select exactly ${teamSize} employees who best match the required skills, experience level, and team balance.
2. Justify why each selected employee is chosen (skills/experience alignment).
3. Provide a **Team Success Probability Score (0–100%)** indicating how likely this team is to succeed.
4. For employees **not selected**, provide reasons why (e.g., missing required skills, overqualified, underqualified, limited team size).
5. Structure the response in JSON with these keys:
{
  "recommendedTeam": [ { name, email, designation, reasonForSelection } ],
  "successProbability": "number%",
  "notSelected": [ { name, email, designation, reasonNotSelected } ]
}
    `;

    // Send to Groq AI
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let aiResponse = completion.choices[0]?.message?.content || "";

    // Try parsing JSON from AI
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (err) {
      console.warn("AI did not return valid JSON. Wrapping in text.", err);
      parsed = { rawResponse: aiResponse };
    }

    return res.status(200).json({
      message: "Project team recommendation generated successfully",
      recommendation: parsed
    });

  } catch (error) {
    console.error("Team Recommendation Error:", error);
    return res.status(500).json({ message: "Failed to generate project team recommendation" });
  }
};





