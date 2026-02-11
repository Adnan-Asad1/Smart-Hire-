import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegCopy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { FiMail, FiShare2 } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import HRLeftSideBar from './HRLeftSideBar';

const BuildInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewLink } = location.state || {};
  const interviewId = interviewLink?.split("/").pop();
  const [userName, setUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidateEmails, setCandidateEmails] = useState("");

  const formData = JSON.parse(localStorage.getItem('formData')) || {
    duration: 0,
    numQuestions: 0,
  };

  console.log("BuildInterview location.state:", location.state);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.fullName);
    }
  }, []);

  const getFullLink = () => `${interviewLink || ''}`;

  const copyToClipboard = () => {
    if (interviewLink) {
      navigator.clipboard.writeText(getFullLink());
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Interview link not found.');
    }
  };

  const shareViaWhatsApp = () => {
    if (interviewLink) {
      const url = `https://wa.me/?text=${encodeURIComponent(getFullLink())}`;
      window.open(url, '_blank');
    } else {
      toast.error('Interview link not found.');
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* Sidebar */}
      <HRLeftSideBar/>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8  ml-64 p-6">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome, {userName || 'Guest'} 👋</h2>
        <p className="text-gray-500 mb-10">Your interview has been created successfully 🎉</p>

        {/* Progress Bar */}
        <div className="w-full mb-10">
          <div className="bg-gray-200 rounded-full h-3 w-full">
            <div className="bg-blue-600 h-3 rounded-full w-full"></div>
          </div>
        </div>

        {/* Tick & Title */}
        <div className="flex flex-col items-center justify-center mt-10 mb-8 space-y-3">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-md">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-4xl font-extrabold text-blue-700 text-center">Your AI Interview is Ready!</h3>
          <p className="text-gray-600 text-center text-sm sm:text-base max-w-xl">
            Share the link below with your candidates to begin the interview process.
            <br />It’s valid for <span className="font-semibold text-green-600">30 days</span>.
          </p>
        </div>

        {/* Interview Card */}
        <div className="max-w-2xl mx-auto bg-white shadow-2xl border border-blue-200 rounded-3xl px-10 py-12 text-center transition-all duration-300 hover:shadow-blue-300">

          {/* Interview Link */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md w-full max-w-2xl mx-auto space-y-6">
            <h4 className="text-lg font-semibold text-blue-800">Interview Link</h4>
            {interviewLink ? (
              <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                <p className="break-words text-blue-900 font-medium text-sm sm:text-base pr-10">
                  {getFullLink()}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 text-blue-700 hover:text-blue-900 transition"
                >
                  <FaRegCopy size={18} />
                </button>
                <p className="text-xs text-gray-500 mt-2">🔗 Link valid for 30 days</p>
              </div>
            ) : (
              <p className="text-gray-400 italic">Interview link not available.</p>
            )}

            {/* Duration & Questions */}
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 mt-4">
              <div className="text-center sm:text-left">
                <p className="text-gray-500 text-sm">⏱ Duration</p>
                <p className="text-xl font-semibold text-gray-800">{formData.duration} minutes</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-gray-500 text-sm">❓ Questions</p>
                <p className="text-xl font-semibold text-gray-800">{formData.numQuestions}</p>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-md w-full max-w-2xl mx-auto space-y-4 mt-8">
            <h4 className="text-gray-800 font-semibold text-lg flex items-center gap-2">📤 Share with Candidates</h4>
            <div className="flex justify-center sm:justify-start flex-wrap gap-4">
              <button
                onClick={shareViaWhatsApp}
                disabled={!interviewLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                  !interviewLink
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-green-100 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-900'
                }`}
              >
                <BsWhatsapp size={20} />
                WhatsApp
              </button>

              <button
                 onClick={() => setIsModalOpen(true)}
                disabled={!interviewLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                  !interviewLink
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800'
                }`}
              >
                <FiMail size={20} />
                Email
              </button>

              <button
                onClick={copyToClipboard}
                disabled={!interviewLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                  !interviewLink
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800'
                }`}
              >
                <FiShare2 size={20} />
                Copy Link
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full font-semibold shadow-md transition-all"
            >
              🔙 Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/create')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-full font-semibold shadow-md transition-all"
            >
              ✨ Create New Interview
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 🌫 Light Overlay (professional look) */}
          <div
            className="absolute inset-0 bg-gray-100/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* ✨ Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-200 z-10 transform transition-all duration-300 scale-95 animate-fadeIn">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg">
                  ✉️
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Send Invitation
              </h2>
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
                          link: getFullLink(),
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

export default BuildInterview;
