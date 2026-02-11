import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HRLeftSideBar from "./HRLeftSideBar";

const ResumeUpload = () => {
  const [interviews, setInterviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loadingId, setLoadingId] = useState(null); // ⭐ Track which row is loading
  const navigate = useNavigate();

  // 🧠 Fetch all interviews from backend
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/resume/get-interviews");
        setInterviews(res.data.interviews || []);
      } catch (err) {
        console.error("Error fetching interviews:", err);
      }
    };

    fetchInterviews();
  }, []);

  // Select file for particular interview
  const handleFileChange = (id, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  // Upload & analyze resume
  const handleUpload = async (interview) => {
    const image = selectedFiles[interview._id];
    if (!image) {
      alert("Please upload a resume first!");
      return;
    }

    setLoadingId(interview._id); // ⭐ Lock UI + show loading on clicked button

    const formData = new FormData();
    formData.append("resumeImage", image);
    formData.append("jobDescription", interview.jobDescription);

    try {
      const res = await axios.post(
        "http://localhost:5000/resume/analyze-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("resumeResult", JSON.stringify(res.data.result));
      navigate("/ResumeResult");
    } catch (err) {
      console.error("Upload Error:", err);
    } finally {
      setLoadingId(null); // ⭐ Unlock UI after request
    }
  };

  return (
    <>
    <HRLeftSideBar />

    <div className="ml-64 min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-6xl border border-gray-200 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30 z-0"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 z-0"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-2">
            🎯 Resume Analyzer
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Upload a resume for each job to analyze compatibility with its job description.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-md">
            <table className="min-w-full bg-white text-sm text-left">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">#</th>
                  <th className="px-6 py-3 font-semibold">Job Position</th>
                  <th className="px-6 py-3 font-semibold">Job Description</th>
                  <th className="px-6 py-3 font-semibold text-center">Resume Upload</th>
                  <th className="px-6 py-3 font-semibold text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {interviews.map((interview, index) => (
                  <tr key={interview._id} className="hover:bg-indigo-50 transition-all duration-200">
                    <td className="px-6 py-4 font-medium text-gray-700">{index + 1}</td>

                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {interview.jobPosition}
                    </td>

                    <td className="px-6 py-4 text-gray-600 max-w-md">
                      <div className="overflow-hidden text-ellipsis whitespace-normal">
                        {interview.jobDescription}
                      </div>
                    </td>

                    {/* DISABLE file input while loading */}
                    <td className="px-6 py-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        disabled={loadingId !== null}
                        onChange={(e) =>
                          handleFileChange(interview._id, e.target.files[0])
                        }
                        className={`w-full max-w-xs p-2 border rounded-lg shadow-sm bg-gray-50 
                          ${loadingId !== null ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                      />
                    </td>

                    {/* Upload Button */}
                    <td className="px-6 py-4 text-center">
                      <button
                        disabled={loadingId !== null}
                        onClick={() => handleUpload(interview)}
                        className={`px-5 py-2 rounded-lg font-semibold shadow-md transition-all 
                          bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                          hover:from-indigo-700 hover:to-purple-700
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {loadingId === interview._id ? (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Analyzing...
                          </div>
                        ) : (
                          "🚀 Upload & Analyze"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}

                {interviews.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No interviews found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ResumeUpload;
