import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HRLeftSideBar from "./HRLeftSideBar";

const ConductedInterviewDetail = () => {
  const [userName, setUserName] = useState("");
  const [interview, setInterview] = useState(null);
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    // ✅ Fetch user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.fullName);
    }

    // ✅ Fetch interview details from localStorage
    const storedInterview = localStorage.getItem("selectedInterview");
    if (storedInterview) {
      const parsedInterview = JSON.parse(storedInterview);

      // Format Created Date
      if (parsedInterview.createdAt) {
        const date = new Date(parsedInterview.createdAt);
        parsedInterview.formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }

      setInterview(parsedInterview);

      // ✅ Fetch conversation data from backend
      fetch(`http://localhost:5000/api/interview/${parsedInterview._id}/conversation`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Format Completed Date
            const completedDate = new Date(data.conversation.updatedAt).toLocaleDateString(
              "en-GB",
              { day: "2-digit", month: "short", year: "numeric" }
            );
            data.conversation.formattedCompletedDate = completedDate;
            setConversation(data.conversation);
          }
        })
        .catch((err) => console.error("Conversation fetch error:", err));
    }
  }, []);

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50 overflow-hidden">
      {/* Sidebar */}
      <HRLeftSideBar/>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8 ml-64">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Welcome Back, {userName || "Guest"} 👋
          </h2>
          <p className="text-gray-500 text-md font-medium mb-8">
            AI-Driven Interviews, Hassle-Free Hiring
          </p>
        </div>

        {/* Interview Detail Section */}
        {interview ? (
          <>
            {/* Interview Card */}
            <div className="bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 transition hover:shadow-3xl relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-blue-700 mb-1">
                    {interview.jobPosition}
                  </h3>
                  {interview.formattedDate && (
                    <p className="text-sm text-gray-500 font-medium">
                      Created On: {interview.formattedDate}
                    </p>
                  )}
                </div>
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 shadow-sm">
                  {interview.duration} Min
                </span>
              </div>

              {/* Tags */}
              {interview.types && interview.types.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {interview.types.map((type, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium shadow-md"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}

              {/* Job Description */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Job Description
                </h4>
                <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-5 rounded-2xl shadow-inner">
                  {interview.jobDescription}
                </p>
              </div>

              {/* Questions */}
              {interview.questions && interview.questions.length > 0 && (
                <div className="mb-10">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Interview Questions ({interview.questions.length})
                  </h4>
                  <div
                    className="space-y-4 pr-3"
                    style={{ maxHeight: "250px", overflowY: "auto" }}
                  >
                    {interview.questions.map((q, index) => (
                      <div
                        key={index}
                        className="p-5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                      >
                        <span className="text-blue-600 font-bold mr-2">
                          Q{index + 1}.
                        </span>
                        <span className="text-gray-800 font-medium">{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ✅ Candidate Info Outside Interview Card */}
  {conversation && (
  <div className="mt-6 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg flex items-center justify-between px-8 py-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
    <div>
      {/* Candidate Name */}
      <p className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
        <span className="relative inline-block">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
            {conversation.candidateName}
          </span>
          <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
        </span>
      </p>

      {/* Completed Date */}
      <p className="text-sm text-gray-700 font-medium flex items-center gap-2 mt-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 shadow-sm">
          📅
        </span>
        <span className="text-gray-600">Completed On:</span>
        <span className="font-semibold text-indigo-600">
          {conversation.formattedCompletedDate}
        </span>
      </p>
    </div>

    {/* View Report Button */}
    <Link to="/FeedbackPage">
    
    <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-2.5 px-7 rounded-xl shadow-md font-semibold text-sm transition-transform transform hover:scale-110 hover:shadow-lg">
      View Report
    </button>
    
    </Link>
  </div>
)}


          </>
        ) : (
          <p className="text-gray-500 text-lg">No interview selected.</p>
        )}
      </div>
    </div>
  );
};

export default ConductedInterviewDetail;
