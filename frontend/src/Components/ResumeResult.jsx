import React, { useEffect, useState } from 'react';

const ResumeResult = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedResult = localStorage.getItem('resumeResult');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          📊 Resume Analysis Report
        </h1>

        {result ? (
          <div className="space-y-6">

            {/* Score Card */}
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-indigo-800">Score</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">{result.score} / 100</p>
            </div>

            {/* Key Skills */}
            <div className="bg-white border rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">✅ Key Skills</h2>
              <ul className="list-disc list-inside text-gray-700 grid grid-cols-2 gap-1">
                {result.keySkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Strong Areas */}
            <div className="bg-green-50 border border-green-300 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-2">🟢 Strong Areas</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {result.strongAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>

            {/* Weak Areas */}
            <div className="bg-red-50 border border-red-300 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-2">🔴 Weak Areas</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {result.weakAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>

            {/* Improvement Tips */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-yellow-700 mb-2">💡 Improvement Tip</h2>
              <p className="text-gray-800">{result.improvementTip}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No result found. Please upload your resume again.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeResult;

