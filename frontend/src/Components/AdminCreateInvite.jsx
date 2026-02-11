// src/pages/CreateRegistrationInvite.jsx
import React, { useState } from "react";
import axios from "axios";
import { Mail, Copy, ExternalLink, Users } from "lucide-react"; // ✅ modern icons
import AdminSidebar from "../components/AdminSidebar";

const AdminCreateInvite = () => {
  const [role, setRole] = useState("Employee");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState(null);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setLink(null);
    try {
      const res = await axios.post("http://localhost:5000/api/invites", {
        role,
        email,
      });

      setLink(res.data.link);
      if (res.data.assignedEmail) {
        setMsg(`Invite sent! Assigned email: ${res.data.assignedEmail}`);
      } else {
        setMsg("Invite sent!");
      }
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.message || "Error sending invite");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide "Copied" after 2s
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* ✅ Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50">
        <AdminSidebar />
      </div>

      {/* ✅ Main Content Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-lg p-10 border border-gray-100 hover:shadow-blue-200 transition-all duration-300">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-full shadow-inner">
              <Mail size={24} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Create Registration Invite
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Send a secure registration link to an employee or HR
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
                <div className="px-3 text-gray-500">
                  <Users size={18} />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 focus:outline-none text-gray-700 bg-transparent"
                >
                  <option>Employee</option>
                  <option>HR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter recipient email"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-xl text-white transition-all text-lg tracking-wide ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? "Sending Invite..." : "Create & Send Invite"}
            </button>
          </form>

          {link && (
            <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Invite Link
              </h4>
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm break-all hover:underline"
                >
                  {link}
                </a>
                <button
                  onClick={copyLink}
                  className={`flex items-center gap-1 ${
                    copied ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-all`}
                >
                  {copied ? (
                    <>✅ Copied</>
                  ) : (
                    <>
                      <Copy size={15} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {msg && (
            <p
              className={`mt-6 text-center font-medium ${
                msg.includes("Error") ? "text-red-500" : "text-green-600"
              }`}
            >
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCreateInvite;
