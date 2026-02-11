import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
const JoinMeeting = () => {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/interview/${interviewId}`);
        const data = res.data.interview;
        setInterviewData(data);
        localStorage.setItem("interviewData", JSON.stringify(data));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch interview:", error);
        setLoading(false);
      }
    };
    // ✅ First check localStorage before API
    const localInterview = localStorage.getItem("interviewData");
    if (localInterview) {
      const parsed = JSON.parse(localInterview);
      setInterviewData(parsed);
      setLoading(false);
    }
    if (interviewId) {
      fetchInterview();
    }
  }, [interviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === "" || email.trim() === "") {
      toast.error("Please fill in all fields before joining the interview.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/interview/${interviewId}/check`
      );

      if (!res.data.success) {
        toast.error("❌ You already gave this interview!");
        return; // stop navigation
      }

      // ✅ Save user info if allowed
      localStorage.setItem("candidateName", name);
      localStorage.setItem("candidateEmail", email);

      navigate("/InterviewSession");
    } catch (error) {
      console.error("Interview check failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
        Loading interview...
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Interview not found or expired.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-xl relative overflow-hidden transition-all border border-gray-200">
        {/* Background accents */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 z-0"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-40 z-0"></div>

        {/* Header */}
        <div className="relative z-10 text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700">AIcruiter</h1>
          <p className="text-sm text-gray-500 mt-1">AI-Powered Interview Platform</p>
        </div>

        {/* Illustration */}
        <div className="relative z-10 mb-6">
          <img
            src="/interview.webp"
            alt="Interview Illustration"
            className="w-60 mx-auto rounded-xl shadow-sm"
          />
        </div>

        {/* Role and Time */}
        <div className="relative z-10 text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {interviewData.jobPosition}
          </h2>
          <p className="text-sm text-gray-500 mt-1">🕒 {interviewData.duration} Min Interview</p>
        </div>

        {/* Form */}
        <form className="relative z-10 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Instructions Box */}
          <div className="bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800 rounded-lg shadow-inner">
            <p className="font-semibold mb-1">Before you begin:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Test your camera and microphone</li>
              <li>Ensure you have a stable internet connection</li>
              <li>Find a quiet environment with good lighting</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              🎥 Join Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinMeeting;
