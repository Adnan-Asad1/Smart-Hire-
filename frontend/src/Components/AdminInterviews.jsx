import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";
import { useNavigate } from "react-router-dom";

const AdminInterviews = () => {
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHRs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/getAllHRs");
        const users = res.data.users;

        // 🔥 Fetch stats for each HR
        const hrWithStats = await Promise.all(
          users.map(async (hr) => {
            try {
              const statsRes = await axios.get(
                `http://localhost:5000/api/interview/user/${hr._id}/stats`
              );
              return {
                ...hr,
                totalInterviews: statsRes.data.totalInterviews,
                conductedCount: statsRes.data.conductedCount,
              };
            } catch (err) {
              console.error(`Error fetching stats for HR ${hr._id}:`, err);
              return {
                ...hr,
                totalInterviews: 0,
                conductedCount: 0,
              };
            }
          })
        );

        setHrs(hrWithStats);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching HRs:", err);
        setLoading(false);
      }
    };
    fetchHRs();
  }, []);

  // ✅ Handle "View All Interviews"
  const handleViewInterviews = (hrId) => {
    localStorage.setItem("selectedHRId", hrId);
    navigate("/AdminHRInterviews");
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading HRs...</p>;
  }

  return (
   <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
    {/* Sidebar */}
    <div className="w-64 fixed left-0 top-0 h-screen">
      <AdminSideBar />
    </div>

    {/* Main Content */}
    <div className="flex-1 ml-64 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-3">
        Registered HRs
      </h1>

        {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
  <table className="min-w-full border-collapse">
    {/* 🔹 Table Header */}
    <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
      <tr>
        <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider w-12">#</th>
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
        <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Role</th>
        <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Exp</th>
        <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Interviews</th>
        <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Conducted</th>
        <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider w-40">Action</th>
      </tr>
    </thead>

    {/* 🔹 Table Body */}
    <tbody className="divide-y divide-gray-100">
      {hrs.map((hr, index) => (
        <tr
          key={hr._id}
          className={`transition-colors duration-200 ${
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          } hover:bg-indigo-50`}
        >
          {/* Serial Number */}
          <td className="px-4 py-4 text-sm font-medium text-gray-700 text-center">
            {index + 1}
          </td>

          {/* Name */}
          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
            {hr.fullName}
          </td>

          {/* Email */}
          <td className="px-6 py-4 text-sm text-gray-600">{hr.email}</td>

          {/* Role */}
          <td className="px-4 py-4 text-sm text-center">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold shadow-sm">
              {hr.hrRole}
            </span>
          </td>

          {/* Experience */}
          <td className="px-4 py-4 text-sm text-gray-700 text-center">
            {hr.experience}
          </td>

          {/* Total Interviews */}
          <td className="px-4 py-4 text-sm text-gray-700 text-center">
            {hr.totalInterviews}
          </td>

          {/* Conducted Interviews */}
          <td className="px-4 py-4 text-sm text-gray-700 text-center">
            {hr.conductedCount}
          </td>

          {/* Action Button */}
          <td className="px-6 py-4 text-center">
            <button
              onClick={() => handleViewInterviews(hr._id)}
              className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition whitespace-nowrap"
            >
              View Interviews
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
};

export default AdminInterviews;
