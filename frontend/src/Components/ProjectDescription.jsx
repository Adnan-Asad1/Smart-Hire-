import React, { useState, useEffect } from "react";
import {
  FaProjectDiagram,
  FaUsers,
  FaRegClock,
  FaDollarSign,
  FaLaptopCode,
} from "react-icons/fa";
import { MdDescription} from "react-icons/md";
import { Link,useNavigate} from "react-router-dom";
import HRLeftSideBar from "./HRLeftSideBar";

const ProjectDescription = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    requiredSkills: "",
    teamSize: "",
    experienceLevel: "",
    budget: "",
  });
  const [userName, setUserName] = useState("");
const navigate=useNavigate();
  useEffect(() => {
    // ✅ Fetch user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.fullName);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (
    !formData.title ||
    !formData.description ||
    !formData.duration ||
    !formData.requiredSkills ||
    !formData.teamSize ||
    !formData.experienceLevel
  ) {
    alert("⚠️ Please fill in all required fields!");
    return;
  }

  if (parseInt(formData.teamSize, 10) < 1) {
    alert("⚠️ Team size must be at least 1.");
    return;
  }

  // ✅ Save to localStorage
  localStorage.setItem("projectData", JSON.stringify(formData));

  // ✅ Navigate to next page
  navigate("/project-team-result");
};


  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* Sidebar */}
      <HRLeftSideBar/>

      {/* Main Content */}
      <div className="flex-1 ml-64 px-10 py-8  p-6">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
            Welcome Back, {userName || "Guest"} 👋
          </h2>
          <p className="text-gray-500 text-md font-medium">
            Build your project team with AI recommendations
          </p>
        </div>

        {/* Form Section */}
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-10 border border-gray-200 hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaProjectDiagram className="text-blue-600" /> Create Project Team
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Project Title */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaProjectDiagram /> Project Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. AI Recruiter Website"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-0 outline-none"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Project Description */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <MdDescription /> Project Description
              </label>
              <textarea
                name="description"
                placeholder="Write scope, requirements, objectives..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-0 outline-none resize-none"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Duration */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaRegClock /> Project Duration
              </label>
              <input
                type="text"
                name="duration"
                placeholder="e.g. 3 months, 6 weeks"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-0 outline-none"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            {/* Required Skills */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaLaptopCode /> Required Skills
              </label>
              <input
                type="text"
                name="requiredSkills"
                placeholder="e.g. React, Node.js, MongoDB"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-0 outline-none"
                value={formData.requiredSkills}
                onChange={handleChange}
                required
              />
            </div>

            {/* Team Size */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaUsers /> Team Size
              </label>
              <input
                type="number"
                name="teamSize"
                min="1"
                placeholder="e.g. 5"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-0 outline-none"
                value={formData.teamSize}
                onChange={handleChange}
                required
              />
            </div>

            {/* Experience Level */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <label className="text-gray-700 font-semibold mb-2">
                Experience Level
              </label>
              <input
                type="text"
                name="experienceLevel"
                placeholder="e.g. 2 years, 6 months"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-0 outline-none"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
              />
            </div>

            {/* Budget */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaDollarSign /> Budget (Optional)
              </label>
              <input
                type="text"
                name="budget"
                placeholder="e.g. 5000 dollars, 200000 PKR"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-0 outline-none"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2 rounded-xl shadow-md font-semibold transition"
              >
                Create Team 🚀
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectDescription;
