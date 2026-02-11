import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import HRLeftSideBar from './HRLeftSideBar';

const ReviewInterview = () => {
  const [userName, setUserName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [tempId, setTempId] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUserName(parsedUser.fullName);
  }

  const storedData = localStorage.getItem('interviewQuestions');
  if (storedData) {
    const { questions: questions2, tempId } = JSON.parse(storedData);
    if (typeof questions2 === 'string') {
      setQuestions(questions2.split('\n').filter(q => q.trim() !== ''));
    } else if (Array.isArray(questions2)) {
      setQuestions(questions2.filter(q => q.trim() !== ''));
    }
    setTempId(tempId);
  }

  // ⏳ Loader delay
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1000);

  return () => clearTimeout(timer);
}, []);


  const handleCreate = async () => {
  try {
     const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5000/api/interview/create', { tempId, questions },{
        headers: {
          Authorization: `Bearer ${token}`, // <-- This is critical
        },
      });

    if (response.data.success) {
      const interviewLink = `http://localhost:5173/interview/${response.data.interviewId}`;
      localStorage.removeItem('interviewQuestions');
      navigate('/BuildInterview', { state: { interviewLink } });
    } else {
      alert('Failed to create interview');
    }
  } catch (error) {
    console.error('Save Error:', error);
    alert('Error saving interview');
  }
};


  const handleFinish = () => {
    localStorage.removeItem('interviewQuestions');
    navigate('/');
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedQuestion(questions[index]);
  };

  const handleSave = () => {
    if (editedQuestion.trim() !== '') {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = editedQuestion.trim();
      setQuestions(updatedQuestions);
      setEditingIndex(null);
      setEditedQuestion('');

      // Save back to localStorage as well (optional)
      localStorage.setItem(
        'interviewQuestions',
        JSON.stringify({ questions: updatedQuestions, tempId })
      );
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedQuestion('');
  };

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* Sidebar */}
      <HRLeftSideBar/>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8  ml-64 p-6">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome, {userName || 'Guest'} 👋</h2>
        <p className="text-gray-500 mb-6">Here are your AI-generated interview questions</p>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-10">
          <div className="bg-blue-600 h-3 rounded-full" style={{ width: '80%' }}></div>
        </div>

        {/* Questions */}
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-4xl mx-auto border border-blue-100">
          <h3 className="text-2xl font-bold text-blue-700 mb-6">🧠 Interview Questions</h3>

          {loading ? (
  <div className="flex flex-col items-center justify-center h-40">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-blue-700 font-semibold text-lg animate-pulse">Loading interview questions...</p>
  </div>
) : (
  <ul className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
    {questions.length > 0 ? (
      questions.map((q, index) => (
        <li key={index} className="flex justify-between items-center bg-gradient-to-r from-blue-50 via-white to-blue-100 border-l-4 border-blue-600 px-4 py-3 rounded shadow-md text-gray-800 font-medium">
          {editingIndex === index ? (
            <div className="flex-1 mr-4">
              <input
                type="text"
                className="w-full border border-gray-300 px-3 py-2 rounded"
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
              />
            </div>
          ) : (
            <span>
              <span className="font-bold text-blue-700 mr-2">{index + 1}.</span> {q}
            </span>
          )}
          <div className="flex gap-2">
            {editingIndex === index ? (
              <>
                <button onClick={handleSave} className="text-green-600 hover:text-green-800" title="Save">
                  <FaSave />
                </button>
                <button onClick={handleCancel} className="text-red-600 hover:text-red-800" title="Cancel">
                  <FaTimes />
                </button>
              </>
            ) : (
              <button onClick={() => handleEdit(index)} className="text-blue-600 hover:text-blue-800" title="Edit">
                <FaEdit />
              </button>
            )}
          </div>
        </li>
      ))
    ) : (
      <p className="text-gray-500">No questions found.</p>
    )}
  </ul>
)}


         <div className="flex justify-center mt-12">
  <button
    onClick={handleCreate}
    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-8 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
  >
    🚀 Create Interview Link & Finish
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default ReviewInterview;
