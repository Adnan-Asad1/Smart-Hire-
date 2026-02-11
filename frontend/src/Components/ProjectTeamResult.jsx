// src/pages/ProjectTeamResult.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, BarChart3, AlertTriangle } from "lucide-react";

const ProjectTeamResult = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const projectData = JSON.parse(localStorage.getItem("projectData"));
        console.log(projectData);
        if (!projectData) return;

        const { data } = await axios.post("http://localhost:5000/api/employees/projectTeam", {
          projectTitle: projectData.title,
          projectDescription: projectData.description,
          projectDuration: projectData.duration,
          requiredSkills: projectData.requiredSkills
            ? projectData.requiredSkills.replace(/"/g, "").split(",").map(s => s.trim())
            : [],
          teamSize: parseInt(projectData.teamSize, 10),
          experienceLevel: projectData.experienceLevel,
          budget: projectData.budget || "Not specified",
        });

        // 🛠 Remove unwanted === signs before parsing
        let responseText = (data?.recommendation?.rawResponse || "").replace(/=+/g, "");

        setRecommendation(parseSections(responseText));
        setNote(data?.note || "");
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

  // Parse AI structured text into sections
  const parseSections = (text) => {
    const selected = extractSection(text, "✅ SELECTED TEAM", "🚫 NOT SELECTED EMPLOYEES");
    const notSelected = extractSection(text, "🚫 NOT SELECTED EMPLOYEES", "📊 SUCCESS PROBABILITY");
    const probability = extractSection(text, "📊 SUCCESS PROBABILITY");

    return { selected, notSelected, probability };
  };

  const extractSection = (text, startMarker, endMarker) => {
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return "";
    const endIndex = endMarker ? text.indexOf(endMarker, startIndex) : text.length;
    return text.substring(startIndex + startMarker.length, endIndex).trim();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-600">
        ⏳ Generating Team Recommendation...
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="text-center mt-20 text-red-500 text-xl font-medium">
        ⚠️ No recommendation found.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div
        className="bg-white shadow-2xl rounded-2xl border border-gray-300 p-10 space-y-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Page Title */}
        <motion.h1
          className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🚀 Project Team Recommendation
        </motion.h1>

        {/* ✅ Selected Team */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 shadow-md rounded-xl border border-green-300 p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-green-700 mb-4">
            <CheckCircle className="w-7 h-7" /> Selected Team
          </h2>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {recommendation.selected || "No team members selected."}
          </div>
        </div>

        {/* 🚫 Not Selected Employees */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 shadow-md rounded-xl border border-red-300 p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-red-700 mb-4">
            <XCircle className="w-7 h-7" /> Not Selected Employees
          </h2>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {recommendation.notSelected || "All employees were selected 🎉"}
          </div>
        </div>

        {/* 📊 Success Probability */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md rounded-xl border border-blue-300 p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-700 mb-4">
            <BarChart3 className="w-7 h-7" /> Success Probability
          </h2>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {recommendation.probability || "No probability data available."}
          </div>
        </div>

        {/* ⚠️ Note Section */}
        {note && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-md rounded-xl border border-yellow-300 p-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-yellow-700 mb-4">
              <AlertTriangle className="w-7 h-7" /> Important Note
            </h2>
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {note}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectTeamResult;
