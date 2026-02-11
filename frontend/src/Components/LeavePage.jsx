import React, { useState, useEffect } from "react";
import {
  Calendar,
  ClipboardList,
  FileText,
  PlusCircle,
  Umbrella,
  Activity,
  CheckCircle,
} from "lucide-react";
import EmployeeLeftSideBar from "./EmployeeLeftSideBar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const LeavePage = () => {
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [history, setHistory] = useState([]);

  // ✅ Fetch Pending & History leaves from backend
  useEffect(() => {
    const token = localStorage.getItem("employeeToken");

    if (!token) {
      toast.error("No employee token found. Please login again.");
      return;
    }

    const fetchLeaves = async () => {
      try {
        // Pending requests
        const pendingRes = await axios.get(
          "http://localhost:5000/api/leave/my/pending",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPendingRequests(pendingRes.data.leaves || []);

        // Leave history (Approved / Rejected)
        const historyRes = await axios.get(
          "http://localhost:5000/api/leave/my/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(historyRes.data.leaves || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch leave data.");
      }
    };

    fetchLeaves();
  }, []);

  // Auto calculate days
  const calculateDays = () => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];

    if (fromDate < today) {
      toast.error("❌ From Date cannot be in the past!");
      return;
    }
    if (toDate < fromDate) {
      toast.error("❌ To Date must be same or after From Date!");
      return;
    }

    try {
      const token = localStorage.getItem("employeeToken");

      const res = await axios.post(
        "http://localhost:5000/api/leave/apply",
        {
          leaveType,
          fromDate,
          toDate,
          days: calculateDays(),
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 send employee token
          },
        }
      );

      toast.success("✅ Leave request submitted successfully!");

      // ✅ Refresh pending list (or push new leave)
     setPendingRequests((prev) => [res.data.leave, ...prev]);


      // Reset form
      setLeaveType("");
      setFromDate("");
      setToDate("");
      setReason("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* ✅ Sidebar (Fixed) */}
      <div className="w-64 fixed h-full ">
        <EmployeeLeftSideBar />
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 ml-64 p-10">
        <Toaster position="top-right" />

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Leave Management
          </h1>
          <p className="text-gray-500">
            Apply for leave and track your requests
          </p>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Casual Leaves",
              count: 5,
              color: "from-green-400 to-emerald-500",
              icon: <Umbrella className="w-7 h-7 text-white" />,
            },
            {
              label: "Sick Leaves",
              count: 3,
              color: "from-orange-400 to-red-500",
              icon: <Activity className="w-7 h-7 text-white" />,
            },
            {
              label: "Annual Leaves",
              count: 10,
              color: "from-blue-400 to-indigo-500",
              icon: <Calendar className="w-7 h-7 text-white" />,
            },
            {
              label: "Leaves Taken",
              count: 12,
              color: "from-purple-500 to-violet-600",
              icon: <CheckCircle className="w-7 h-7 text-white" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-md p-6 bg-gradient-to-br ${item.color} 
                  hover:scale-105 transition transform flex flex-col items-center text-white`}
            >
              <div className="mb-3">{item.icon}</div>
              <p className="text-lg font-medium">{item.label}</p>
              <p className="text-3xl font-extrabold">{item.count}</p>
            </div>
          ))}
        </div>

        {/* ✅ Apply for Leave Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
          {/* Header Bar */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-5">
            <PlusCircle className="w-7 h-7 text-white" />
            <h2 className="text-xl font-bold text-white">Apply for Leave</h2>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            {/* Leave Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Leave Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Leave Type */}
                <div>
                  <label className="block text-gray-600 font-medium mb-2">
                    Leave Type
                  </label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    required
                    className="w-full border-gray-300 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="Casual">Casual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Annual">Annual Leave</option>
                    <option value="Maternity/Paternity">
                      Maternity/Paternity Leave
                    </option>
                  </select>
                </div>

                {/* From Date */}
                <div>
                  <label className="block text-gray-600 font-medium mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border-gray-300 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-gray-600 font-medium mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    required
                    min={fromDate || new Date().toISOString().split("T")[0]}
                    className="w-full border-gray-300 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Auto Days */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-gray-600 font-medium">Total Days:</span>
                <span className="bg-gray-100 px-6 py-2 rounded-lg text-gray-900 font-bold shadow-sm">
                  {calculateDays()}
                </span>
              </div>
            </div>

            {/* Reason */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Reason
              </h3>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Briefly explain your reason..."
                className="w-full border-gray-300 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-blue-500 resize-none"
                rows="4"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="reset"
                onClick={() => {
                  setLeaveType("");
                  setFromDate("");
                  setToDate("");
                  setReason("");
                }}
                className="bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl shadow hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-10 rounded-xl shadow-lg hover:scale-105 transition"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
{/* Pending Requests */}
<div className="bg-white rounded-2xl shadow-lg p-10 mb-12 border border-gray-200">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
    <ClipboardList className="w-7 h-7 text-yellow-500" /> Pending Requests
  </h2>
  {pendingRequests.length > 0 ? (
    <div className="max-h-80 overflow-y-auto rounded-lg">
      <table className="w-full border-collapse">
        <thead className="bg-gradient-to-r from-yellow-100 to-yellow-200 sticky top-0 z-10">
          <tr>
            <th className="p-3 text-left text-gray-700 font-semibold">
              Leave Type
            </th>
            <th className="p-3 text-left text-gray-700 font-semibold">From</th>
            <th className="p-3 text-left text-gray-700 font-semibold">To</th>
            <th className="p-3 text-left text-gray-700 font-semibold">Days</th>
            <th className="p-3 text-left text-gray-700 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests.map((req, i) => (
            <tr
              key={req._id}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="p-3">{req.leaveType}</td>
              <td className="p-3">
                {new Date(req.fromDate).toLocaleDateString()}
              </td>
              <td className="p-3">
                {new Date(req.toDate).toLocaleDateString()}
              </td>
              <td className="p-3">{req.days}</td>
              <td className="p-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                  {req.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-gray-500">No pending requests.</p>
  )}
</div>

      {/* Leave History */}
<div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
    <FileText className="w-7 h-7 text-green-600" /> Leave History
  </h2>
  {history.length > 0 ? (
    <div className="max-h-96 overflow-y-auto rounded-lg ">
      <table className="w-full border-collapse">
        <thead className="bg-gradient-to-r from-green-100 to-green-200 sticky top-0 z-10">
          <tr>
            <th className="p-3 text-left text-gray-700 font-semibold">
              Leave Type
            </th>
            <th className="p-3 text-left text-gray-700 font-semibold">From</th>
            <th className="p-3 text-left text-gray-700 font-semibold">To</th>
            <th className="p-3 text-left text-gray-700 font-semibold">Days</th>
            <th className="p-3 text-left text-gray-700 font-semibold">Status</th>
            <th className="p-3 text-left text-gray-700 font-semibold">
              Approved By
            </th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr
              key={h._id}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="p-3">{h.leaveType}</td>
              <td className="p-3">
                {new Date(h.fromDate).toLocaleDateString()}
              </td>
              <td className="p-3">
                {new Date(h.toDate).toLocaleDateString()}
              </td>
              <td className="p-3">{h.days}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    h.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : h.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {h.status}
                </span>
              </td>
              <td className="p-3">{h.approvedBy || "—"} HR</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-gray-500">No leave history available.</p>
  )}
</div>
      </div>
    </div>
  );
};

export default LeavePage;
