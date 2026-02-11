import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import HRLeftSideBar from "./HRLeftSideBar";

const InterviewDetailCard = () => {
  const [userName, setUserName] = useState("");
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.fullName);
    }

    const fetchConducted = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/interview/GetConducted", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data)
        if (res.data.success) {
          setInterviews(res.data.interviews);
        }
      } catch (err) {
        console.error("Error fetching conducted interviews:", err);
      }
    };

    fetchConducted();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // ✅ Function to handle View Detail
  const handleViewDetail = (interview) => {
    localStorage.setItem("selectedInterview", JSON.stringify(interview)); // save full object
    navigate("/ConductedInterviewDetail"); // go to next page
  };

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* Sidebar */}
    <HRLeftSideBar/>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8 overflow-y-auto ml-64 p-6">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Welcome Back, {userName || "Guest"} 👋
          </h2>
          <p className="text-gray-500 text-md font-medium">
            AI-Driven Interviews, Hassle-Free Hiring
          </p>
        </div>

        {/* ✅ Interview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div
              key={interview._id}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                <p className="text-sm text-gray-500">
                  {formatDate(interview.createdAt)}
                </p>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mt-3">
                {interview.jobPosition}
              </h3>
              <div className="flex justify-between">
                <p className="text-gray-500 text-sm mt-1">
                  {interview.duration} Min
                </p>
                <p className="text-green-600 text-sm font-medium mt-1">
                  1 Candidate
                </p>
              </div>
             
              
              <button
                onClick={() => handleViewDetail(interview)} // 👈 pass that interview
                className="mt-4 w-full border rounded-lg py-2 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                View Detail →
              </button>
              
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailCard;
