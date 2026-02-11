import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import{Link} from 'react-router-dom';
import { toast } from 'react-hot-toast';
import HRLeftSideBar from './HRLeftSideBar';
const CreateInterview = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({
    jobPosition: '',
    jobDescription: '',
    duration: '',
    types: [],
    numQuestions: 10,
  });

  const interviewTypes = ['Technical', 'Behavioral', 'Problem Solving', 'Experience', 'Leadership'];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.fullName);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeToggle = (type) => {
    const updatedTypes = formData.types.includes(type)
      ? formData.types.filter(t => t !== type)
      : [...formData.types, type];
    setFormData({ ...formData, types: updatedTypes });
  };

const handleSubmit = async () => {
  const { jobPosition, jobDescription, duration, types, numQuestions } = formData;

  // 🛑 Form Validation
  if (!jobPosition || !jobDescription || !duration || !types.length || !numQuestions) {
    toast.error("Please fill all fields and select at least one interview type.");
    return;
  }

  if (duration <= 0 || numQuestions <= 0) {
    toast.error("Duration and number of questions must be greater than 0.");
    return;
  }

  try {
    // ✅ Get token from localStorage
    const storedUser = localStorage.getItem("user");
    const token=localStorage.getItem('token');

    if (!token) {
      toast.error("You must be logged in to create an interview.");
      return;
    }

    const response = await axios.post(
      "http://localhost:5000/api/interview/generate-only",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token bhejna zaroori hai
        },
      }
    );

    if (response.data.success) {
      const { questions, tempId } = response.data;

      // Save to localStorage
      localStorage.setItem(
        "interviewQuestions",
        JSON.stringify({ questions, tempId })
      );
      localStorage.setItem("formData", JSON.stringify(formData));

      // ✅ Navigate immediately
      navigate("/ReviewInterview");
    } else {
      toast.error(response.data.error || "Question generation failed. Please try again.");
    }
  } catch (error) {
    console.error("Error generating questions:", error);

    // ✅ Agar credits = 0 ka error aaya ho
    if (error.response && error.response.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Server error. Please try again later.");
    }
  }
};




  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* Sidebar */}
   <HRLeftSideBar/>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8 ml-64 p-6">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome, {userName || 'Guest'} 👋</h2>
        <p className="text-gray-500 mb-6">Let’s setup your new AI Interview</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-10">
          <div className="bg-blue-600 h-3 rounded-full" style={{ width: '40%' }}></div>
        </div>

        {/* Form */}
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-3xl mx-auto border border-blue-100">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700">Job Position</label>
            <input
              type="text"
              name="jobPosition"
              value={formData.jobPosition}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700">Job Description</label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              rows="4"
              className="resize-none mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Interview Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Number of Questions</label>
              <input
                type="number"
                name="numQuestions"
                value={formData.numQuestions}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Interview Types</label>
            <div className="flex flex-wrap gap-3">
              {interviewTypes.map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`px-4 py-2 rounded-full border text-sm ${
                    formData.types.includes(type)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300'
                  } hover:shadow-lg transition`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-xl text-lg font-bold shadow-xl transition duration-300 mt-6"
          >
            🚀 Generate Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;
