import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import HRLeftSideBar from "./HRLeftSideBar";

const AllCreatedInterviews = () => {
  const [userName, setUserName] = useState("");
  const [interviews, setInterviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [candidateEmails, setCandidateEmails] = useState("");
const [selectedLink, setSelectedLink] = useState(""); // store link for popup


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.fullName);
    }

    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/api/interview/GetInterviews", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setInterviews(data.interviews);
          } else {
            console.error(data.error || "Failed to load interviews");
          }
        })
        .catch((err) => console.error("Error fetching interviews:", err));
    }
  }, []);

  // ✅ Copy Link Function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("✅ Link copied to clipboard!");
  };

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* Sidebar */}
      <HRLeftSideBar/>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8 flex flex-col ml-64 p-6">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Welcome Back, {userName || "Guest"} 👋
          </h2>
          <p className="text-gray-500 text-md font-medium">
            AI-Driven Interviews, Hassle-Free Hiring
          </p>
        </div>

        {/* ✅ Cards Section with scroll */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => {
              const formattedDate = new Date(
                interview.createdAt
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const uniqueLink = `http://localhost:5173/interview/${interview._id}`;

              return (
                <div
                  key={interview._id}
                  className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between"
                >
                  {/* Top Section */}
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-600"></div>
                    <span className="text-gray-500 text-sm">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="mt-4 text-lg font-bold text-gray-800">
                    {interview.jobPosition || "Untitled Job"}
                  </h3>
                  <p className="text-gray-500">
                    {interview.duration || "N/A"} Min
                  </p>

                  {/* Buttons */}
                  <div className="flex space-x-3 mt-5">
                    <button
                      onClick={() => copyToClipboard(uniqueLink)}
                      className="flex-1 flex items-center justify-center border border-blue-500 text-blue-600 rounded-lg py-2 hover:bg-blue-50 text-sm"
                    >
                      Copy Link
                    </button>
                    <button
  onClick={() => {
    setSelectedLink(uniqueLink); // save link for popup
    setIsModalOpen(true); // open modal
  }}
  className="flex-1 flex items-center justify-center bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 text-sm"
>
  Send
</button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* 🌫 Light Overlay */}
    <div
      className="absolute inset-0 bg-gray-100/40 backdrop-blur-[2px] transition-opacity"
      onClick={() => setIsModalOpen(false)}
    ></div>

    {/* ✨ Modal Content */}
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-200 z-10">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg">
            ✉️
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Send Invitation</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter the candidate’s email to share the interview link.
        </p>
      </div>

      {/* Email Input */}
      <input
        type="email"
        value={candidateEmails}
        onChange={(e) => setCandidateEmails(e.target.value)}
        placeholder="candidate@company.com"
        className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition"
      />

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              const response = await fetch(
                "http://localhost:5000/api/auth/send-interview-link",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: candidateEmails.trim(),
                    link: selectedLink, // ✅ send link of selected interview
                  }),
                }
              );

              if (response.ok) {
                toast.success("Invitation sent successfully 🎉");
                setCandidateEmails("");
                setIsModalOpen(false);
              } else {
                toast.error("Failed to send invitation");
              }
            } catch (err) {
              toast.error("Error sending email");
              console.error(err);
            }
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition"
        >
          Send
        </button>
      </div>
    </div>
  </div>
)}

    
    </div>
  );
};

export default AllCreatedInterviews;
