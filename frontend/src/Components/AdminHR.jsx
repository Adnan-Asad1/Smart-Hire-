// src/pages/AdminHR.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Save, Plus } from "lucide-react";
import AdminSideBar from "./AdminSideBar";

const AdminHR = () => {
  const [hrUsers, setHrUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ For adding HR
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHR, setNewHR] = useState({
    fullName: "",
    email: "",
    hrRole: "",
    experience: "",
    skills: "",
    password: "",
  });

  // ✅ Fetch HRs from backend
  const fetchHRs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/getAllHRs");
      setHrUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching HRs:", err);
    }
  };

  useEffect(() => {
    fetchHRs();
  }, []);

  // ✅ Handle input change while editing
  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // ✅ Start editing
  const handleEdit = (hr) => {
    setEditingId(hr._id);
    setFormData(hr);
  };

  // ✅ Save updates
  const handleSave = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/updateHR/${id}`,
        formData
      );
      setEditingId(null);
      fetchHRs(); // refresh list
    } catch (err) {
      console.error("Error updating HR:", err);
    }
  };

  // ✅ Add HR
  const handleAddHR = async (e) => {
    e.preventDefault(); // stop page reload
    try {
      await axios.post("http://localhost:5000/api/auth/createHRByAdmin", {
        ...newHR,
        skills: newHR.skills,
      });

      setShowAddModal(false);
      setNewHR({
        fullName: "",
        email: "",
        hrRole: "",
        experience: "",
        skills: "",
        password: "",
      });
      fetchHRs();
    } catch (err) {
      console.error("Error adding HR:", err);
    }
  };

  // ✅ Delete HR
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this HR?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/deleteHR/${id}`
      );
      fetchHRs();
    } catch (err) {
      console.error("Error deleting HR:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Manage HRs
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2 rounded-xl shadow-md transition"
          >
            <Plus size={18} /> Add HR
          </button>
        </div>

        <div className="overflow-x-auto bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            {/* Header */}
            <thead className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-600 text-white shadow-lg">
              <tr>
                {["Name", "Email", "HR Role", "Experience", "Skills", "Actions"].map(
                  (head, i) => (
                    <th
                      key={i}
                      className={`px-6 py-4 text-left font-semibold uppercase tracking-wider ${
                        i === 0 ? "rounded-tl-2xl" : i === 5 ? "rounded-tr-2xl" : ""
                      }`}
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {hrUsers.map((hr, index) => (
                <tr
                  key={hr._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50/80" : "bg-white/90"
                  } hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md transition duration-300`}
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    {editingId === hr._id ? (
                      <input
                        type="text"
                        value={formData.fullName || ""}
                        onChange={(e) => handleChange(e, "fullName")}
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{hr.fullName}</span>
                    )}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    {editingId === hr._id ? (
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => handleChange(e, "email")}
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      />
                    ) : (
                      <span className="text-gray-600">{hr.email}</span>
                    )}
                  </td>

                  {/* HR Role */}
                  <td className="px-6 py-4">
                    {editingId === hr._id ? (
                      <input
                        type="text"
                        value={formData.hrRole || ""}
                        onChange={(e) => handleChange(e, "hrRole")}
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      />
                    ) : (
                      <span className="text-indigo-700 font-medium">{hr.hrRole}</span>
                    )}
                  </td>

                  {/* Experience */}
                  <td className="px-6 py-4">
                    {editingId === hr._id ? (
                      <input
                        type="text"
                        value={formData.experience || ""}
                        onChange={(e) => handleChange(e, "experience")}
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      />
                    ) : (
                      <span className="text-gray-700">{hr.experience}</span>
                    )}
                  </td>

                  {/* Skills */}
                  <td className="px-6 py-4">
                    {editingId === hr._id ? (
                      <input
                        type="text"
                        value={formData.skillsInput || formData.skills?.join(", ") || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            skillsInput: e.target.value,
                            skills: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s !== ""),
                          })
                        }
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      />
                    ) : (
                      <span className="text-gray-600">
                        {hr.skills?.join(", ") || "—"}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 flex justify-center gap-3">
                    {editingId === hr._id ? (
                      <button
                        onClick={() => handleSave(hr._id)}
                        className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl shadow-md transition"
                      >
                        <Save size={16} /> Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(hr)}
                        className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl shadow-md transition"
                      >
                        <Pencil size={16} /> Edit
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setDeleteId(hr._id);
                        setShowConfirm(true);
                      }}
                      className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-2 rounded-xl shadow-md transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No HRs Message */}
          {hrUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-lg font-medium">
              🚀 No HRs found.
            </div>
          )}
        </div>
      </div>

      {/* ✅ Delete Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 text-center">
            <h2 className="text-lg font-bold text-gray-800">⚠️ Confirm Delete</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this HR?
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(
                      `http://localhost:5000/api/auth/deleteHR/${deleteId}`
                    );
                    fetchHRs();
                  } catch (err) {
                    console.error("Error deleting HR:", err);
                  }
                  setShowConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Add HR Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[450px]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">➕ Add New HR</h2>
            <form onSubmit={handleAddHR} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newHR.fullName}
                onChange={(e) => setNewHR({ ...newHR, fullName: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newHR.email}
                onChange={(e) => setNewHR({ ...newHR, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                required
              />
              <input
                type="text"
                placeholder="HR Role"
                value={newHR.hrRole}
                onChange={(e) =>
                  setNewHR({ ...newHR, hrRole: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                required
              />
              <input
                type="text"
                placeholder="Experience"
                value={newHR.experience}
                onChange={(e) =>
                  setNewHR({ ...newHR, experience: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                required
              />
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={newHR.skills}
                onChange={(e) =>
                  setNewHR({ ...newHR, skills: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newHR.password}
                onChange={(e) =>
                  setNewHR({ ...newHR, password: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                required
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHR;
