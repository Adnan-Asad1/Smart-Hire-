import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaChartBar, FaQuestionCircle, FaStar } from "react-icons/fa";

const FeedbackPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedInterview = localStorage.getItem("selectedInterview");
    if (!storedInterview) {
      setError("No interview selected!");
      setLoading(false);
      return;
    }

    let interviewId = null;
    try {
      const parsed = JSON.parse(storedInterview);
      interviewId = parsed._id || parsed.interviewId;
    } catch (err) {
      setError("Invalid interview data in localStorage.");
      setLoading(false);
      return;
    }

    if (!interviewId) {
      setError("Interview ID not found.");
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/interview/${interviewId}/feedback`
        );
        const data = await response.json();
        if (data.success) {
          parseReport(data.feedbackReport);
        } else {
          setError(data.message || "Failed to fetch report.");
        }
      } catch (err) {
        setError("Server error while fetching report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  // Parse AI report
  const parseReport = (text) => {
    const parts = text.split(/\n\*\*/).map((p) => {
      let content = p.replace(/\*\*/g, "").trim();
      if (!content) return null;
      const [heading, ...rest] = content.split("\n");
      return { heading: heading.trim(), body: rest.join("\n").trim() };
    });

    let cleanedParts = parts.filter(Boolean);

    const questionRegex = /^(Q\d+|Question\s*\d+|^\d+\.)/i;
    const allLines = text.split("\n");
    const questionLines = allLines.filter((line) =>
      questionRegex.test(line.trim())
    );

    if (questionLines.length > 0) {
      const hasQuestionSection = cleanedParts.some((sec) =>
        sec.heading.toLowerCase().includes("question")
      );
      if (!hasQuestionSection) {
        cleanedParts.splice(1, 0, {
          heading: "Questions & Responses",
          body: questionLines.join("\n"),
        });
      }
    }

    setSections(cleanedParts);
  };

  // Render Evaluation Scores
  const renderScores = (body) => {
    const scoreRegex = /(.*?):\s*(\d{1,2})(?:\/10)?\s*(.*)?/;
    const lines = body.split("\n").filter((l) => l.trim() !== "");

    return (
      <div className="space-y-6">
        {lines.map((line, idx) => {
          const match = line.match(scoreRegex);
          if (!match)
            return <p key={idx} className="text-gray-700">{line}</p>;

          const [, label, score, reason] = match;
          let value = parseInt(score, 10);
          const max = 10;
          if (value > max) value = max;

          return (
            <motion.div
              key={idx}
              className="p-5 rounded-2xl bg-white/70 backdrop-blur-lg border border-blue-100 shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-blue-800">{label}</span>
                <span className="text-blue-600 font-medium">{value}/10</span>
              </div>
             <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
  <motion.div
    className={`h-3 rounded-full ${
      value >= 7
        ? "bg-gradient-to-r from-green-300 to-green-500" // softer green
        : value >= 4
        ? "bg-gradient-to-r from-amber-200 to-amber-400" // light yellow/amber
        : "bg-gradient-to-r from-red-300 to-red-500" // soft red
    }`}
    initial={{ width: 0 }}
    animate={{ width: `${(value / 10) * 100}%` }}
    transition={{ duration: 1, ease: "easeOut" }}
  ></motion.div>
</div>

              {reason && (
                <p className="text-sm text-gray-500 mt-2 italic">{reason.trim()}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Render Markdown tables
  const renderTable = (body) => {
    if (!body.includes("|") || !body.includes("---")) {
      return <p className="text-gray-700 whitespace-pre-line">{body}</p>;
    }

    const lines = body.split("\n").filter((l) => l.trim() !== "");
    const rows = lines.map((line) => line.split("|").map((cell) => cell.trim()));
    if (rows.length < 2) return <p>{body}</p>;

    const headers = rows[0];
    const dataRows = rows.slice(2);

    return (
      <div className="overflow-x-auto rounded-xl border border-blue-200 shadow-lg">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-blue-50/40" : "bg-white"}>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 border-t border-blue-100 text-gray-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Pick icons
  const getIcon = (heading) => {
    if (heading.toLowerCase().includes("evaluation")) return <FaStar className="text-yellow-500 text-xl" />;
    if (heading.toLowerCase().includes("question")) return <FaQuestionCircle className="text-blue-500 text-xl" />;
    return <FaChartBar className="text-green-500 text-xl" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-700 mb-12 text-center drop-shadow-lg">
          Interview Feedback Report
        </h1>

        {loading && (
          <p className="text-gray-600 text-lg animate-pulse text-center">
            ⏳ Generating AI report...
          </p>
        )}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg shadow-md text-center">
            ❌ {error}
          </div>
        )}

        {!loading && !error && (
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 space-y-10 border border-blue-100 hover:shadow-[0_12px_50px_rgba(0,0,0,0.15)] transition-all duration-500"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {sections.map((sec, idx) => (
              <motion.div
                key={idx}
                className="pb-8 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {getIcon(sec.heading)}
                  <h2 className="text-2xl font-bold text-blue-900 tracking-tight">
                    {sec.heading}
                  </h2>
                </div>

                {sec.heading.toLowerCase().includes("evaluation")
                  ? renderScores(sec.body)
                  : sec.heading.toLowerCase().includes("question and response summary")
                  ? renderTable(sec.body)
                  : <p className="text-gray-700 leading-relaxed whitespace-pre-line">{sec.body}</p>}

                {/* glowing divider */}
                {idx < sections.length - 1 && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-70"></div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
