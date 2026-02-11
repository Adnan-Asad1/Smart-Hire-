import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("interviewStartTime");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-100 animate-gradient-x px-6 relative overflow-hidden">
      
      {/* Animated gradient orbs for decoration */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-300/20 rounded-full blur-3xl animate-spin-slow"></div>

      {/* Glass card */}
      <div className="relative bg-white/30 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-blue-100 transition-all duration-500 hover:scale-105 hover:shadow-blue-400/40">
        
        {/* Floating success icon */}
        <div className="flex justify-center">
          <FaCheckCircle className="text-blue-500 text-8xl mb-6 drop-shadow-lg animate-float" />
        </div>

        {/* Title with gradient text */}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300 bg-clip-text text-transparent drop-shadow-lg mb-4">
          Thank You!
        </h1>

        {/* Subtitle */}
        <p className="text-gray-700 text-lg leading-relaxed mb-10">
          Your interview has been <span className="font-semibold text-blue-600">successfully completed</span>.  
          We truly appreciate your time and effort. Our team will reach out soon with the next steps.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="relative inline-block px-10 py-4 text-lg font-semibold rounded-full overflow-hidden group bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 transition-transform duration-300 transform translate-x-full group-hover:translate-x-0"></span>
          <span className="relative z-10">Back to Home</span>
        </button>
      </div>

      {/* Floating background accents */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
};

export default ThankYouPage;