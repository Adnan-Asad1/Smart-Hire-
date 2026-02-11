import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminSideBar from "./AdminSideBar";

const AdminHRInterviewDetail = () => {
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const interviewId = localStorage.getItem("selectedInterviewId");
        if (!interviewId) return;

        const res = await axios.get(
          `http://localhost:5000/api/interview/${interviewId}/details`
        );
        setInterviewDetails(res.data);
      } catch (error) {
        console.error("Error fetching interview details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, []);

  if (loading) {
    return <p className="text-center text-lg">Loading Interview Details...</p>;
  }

  if (!interviewDetails || !interviewDetails.success) {
    return <p className="text-center text-red-500">Interview not found</p>;
  }

  const { interview, conducted, candidate } = interviewDetails;

  // ✅ Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen">
      {/* Sidebar - Fixed */}
      <div className="fixed top-0 left-0 w-64 h-screen  shadow-lg z-50">
        <AdminSideBar />
      </div>

      {/* Main Content with left padding */}
<div className="flex-1 pl-64 p-10 flex justify-center">       
   <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl rounded-3xl p-10 w-full max-w-6xl relative border border-gray-200 hover:shadow-3xl transition-shadow"
        >
          {/* Header with title & duration pill */}
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
                {interview.jobPosition}
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Created On: {formatDate(interview.createdAt)}
              </p>
            </div>
            <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md">
              ⏱ {interview.duration} Min
            </span>
          </div>

          {/* Type badge */}
          <div className="mb-8 flex flex-wrap gap-2">
            {interview.types.map((type, idx) => (
              <span
                key={idx}
                className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm"
              >
                {type}
              </span>
            ))}
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3">
              📌 Job Description
            </h2>
            <div className="border rounded-lg p-4 text-gray-700 bg-gray-50 leading-relaxed shadow-inner">
              {interview.jobDescription}
            </div>
          </div>

          {/* Questions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3">
              📝 Interview Questions ({interview.questions.length})
            </h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {interview.questions.map((q, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <span className="text-blue-700 font-bold mr-2">
                    Q{index + 1}.
                  </span>
                  <span className="text-gray-800">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conducted Info */}
          <div
            className={`p-6 rounded-2xl mt-8 shadow-md border ${
              conducted
                ? "bg-green-50 border-green-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            {conducted ? (
              <>
                <h2 className="text-xl font-bold text-green-700 mb-4">
                  ✅ Interview Conducted
                </h2>
                <p className="text-gray-800 mb-1">
                  <span className="font-medium">Candidate Name:</span>{" "}
                  {candidate.name}
                </p>
                <p className="text-gray-800 mb-1">
                  <span className="font-medium">Email:</span> {candidate.email}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Conducted On:</span>{" "}
                  {formatDate(candidate.date)}
                </p>
              </>
            ) : (
              <h2 className="text-xl font-bold text-yellow-700">
                ⚠️ Interview Not Conducted Yet
              </h2>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHRInterviewDetail;
