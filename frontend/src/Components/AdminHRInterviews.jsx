import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";

const AdminHRInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const hrId = localStorage.getItem("selectedHRId"); // ✅ get saved HR id
        if (!hrId) return;

        const res = await axios.get(
          `http://localhost:5000/api/interview/user/${hrId}`
        );
        setInterviews(res.data.interviews || []);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading) {
    return <p className="text-center text-lg">Loading Interviews...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full ">
        <AdminSideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
          All Interviews by HR
        </h1>

        {interviews.length === 0 ? (
          <p className="text-gray-500">No interviews created by this HR yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <motion.div
                key={interview._id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between p-5 border border-gray-200"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {interview.jobPosition}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Duration: {interview.duration} mins
                  </p>
                  {interview.urgent && (
                    <span className="inline-block mb-2 px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                      ⚡ Urgent
                    </span>
                  )}

                  <p className="text-gray-600 mb-3">
                    <span className="font-medium">Description:</span>{" "}
                    {interview.jobDescription.length > 80
                      ? interview.jobDescription.slice(0, 80) + "..."
                      : interview.jobDescription}
                  </p>

                  <p className="text-gray-600">
                    <span className="font-medium">Types:</span>{" "}
                    {interview.types.join(", ")}
                  </p>
                </div>

                {/* ✅ View Details Button bottom aligned */}
                <button
                  className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
                  onClick={() => {
                    localStorage.setItem(
                      "selectedInterviewId",
                      interview._id
                    );
                    navigate("/AdminHRInterviewDetail");
                  }}
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHRInterviews;
