import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import HRLeftSideBar from "./HRLeftSideBar";

const PendingLeaves = () => {
  const [userName, setUserName] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  // ✅ New states for Approve/Reject confirmation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [decisionType, setDecisionType] = useState(""); // "Approved" | "Rejected"
  const [rejectReason, setRejectReason] = useState(""); // Optional reject reason

  // ✅ Fetch user info + leaves
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.fullName || parsedUser.name);
    }

    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/leave/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setLeaves(data.leaves);
      } else {
        toast.error(data.message || "Failed to fetch leaves");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching leaves");
    }
  };

  // ✅ Open confirm modal
  const openConfirmModal = (leave, type) => {
    setSelectedLeave(leave);
    setDecisionType(type);
    setRejectReason("");
    setIsConfirmModalOpen(true);
  };

  // ✅ Final decision after confirmation
  const handleDecision = async () => {
    if (!selectedLeave || !decisionType) return;

     setIsConfirmModalOpen(false);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/leave/${selectedLeave._id}/decision`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            decision: decisionType,
            rejectReason: decisionType === "Rejected" ? rejectReason : null,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(`Leave ${decisionType}`);
        fetchLeaves(); // Refresh leaves
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating leave");
    } finally {
     
      setSelectedLeave(null);
      setDecisionType("");
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* Sidebar */}
     <HRLeftSideBar/>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8 ml-64 p-6">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Welcome Back, {userName || "Guest"} 👋
          </h2>
          <p className="text-gray-500 text-md font-medium">
            Here are the pending leave requests.
          </p>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Pending Leaves
          </h3>

          {leaves.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No pending leave requests ✅
            </p>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-300/70 hover:scrollbar-thumb-blue-500">
              <table className="min-w-full table-auto border-collapse">
                <thead className="sticky top-0 bg-blue-50 z-10">
                  <tr className="text-blue-600 text-left">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Leave Type</th>
                    <th className="p-3">Days</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{leave.employeeId?.name || "N/A"}</td>
                      <td className="p-3">{leave.employeeId?.email || "N/A"}</td>
                      <td className="p-3">{leave.leaveType}</td>
                      <td className="p-3">{leave.days}</td>
                      <td className="p-3 font-semibold text-yellow-600">
                        {leave.status}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedReason(
                              leave.reason || "No reason provided"
                            );
                            setIsReasonModalOpen(true);
                          }}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View Reason
                        </button>
                      </td>
                      <td className="p-3 text-center space-x-3">
                        <button
                          onClick={() => openConfirmModal(leave, "Approved")}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openConfirmModal(leave, "Rejected")}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reason Modal */}
{isReasonModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full transform transition-all scale-95 animate-fadeIn border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
        Leave Reason
        <button
          onClick={() => setIsReasonModalOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
      </h3>

      {/* Scrollable + Wrapping content */}
      <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words">
          {selectedReason}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setIsReasonModalOpen(false)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 
                   text-white font-medium rounded-xl shadow-md 
                   hover:from-blue-700 hover:to-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{/* Confirm Modal (Approve/Reject) */}
{isConfirmModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full transform transition-all scale-95 animate-fadeIn border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
        Confirm {decisionType}
        <button
          onClick={() => setIsConfirmModalOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
      </h3>

      <p className="text-gray-700 mb-4">
        Are you sure you want to{" "}
        <span
          className={
            decisionType === "Approved"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {decisionType}
        </span>{" "}
        this leave request?
      </p>

      {/* Reject reason input (optional) */}
      {decisionType === "Rejected" && (
        <div className="mb-4">
          <label className="block text-gray-600 mb-2 text-sm">
            Reason for rejection (optional)
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none resize-none"
            rows="3"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setIsConfirmModalOpen(false)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDecision}
          className={`px-5 py-2.5 rounded-lg text-white font-medium shadow-md transition ${
            decisionType === "Approved"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default PendingLeaves;
