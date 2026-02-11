import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ThankYouPage.jsx
// Props:
// - userName (string) optional
// - assignedEmail (string) optional (e.g. SH-2025-001@gmail.com)
// - role (string) optional: 'HR' | 'Employee'
// - loginUrl (string) optional: where to go next (e.g. '/login')
// - onClose (function) optional: callback if you want to close modal or navigate elsewhere
export default function ThankYouPageRegistration({
  userName = "",
  assignedEmail = "",
  role = "Employee",
  loginUrl = "/login",
  onClose,
}) {
  // prefer props but keep reactive local state that reads localStorage at mount
  const [localAssignedEmail, setLocalAssignedEmail] = useState(assignedEmail || "");
  const [localRole, setLocalRole] = useState(role || "Employee");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
  const se = localStorage.getItem("assignedEmail");
  if (se) setLocalAssignedEmail(se);

   const sr = localStorage.getItem("role");
   if (sr) setLocalRole(sr);
    
  }, [assignedEmail, role]);

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localAssignedEmail || "");
      setCopied(true);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleNext = () => {
    if (onClose) return onClose();
    window.location.href = loginUrl;
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-3xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100"
      >
        {/* Top decorative band */}
        <div className="absolute -top-8 right-6">
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs />
            <g opacity="0.12">
              <circle cx="80" cy="80" r="80" fill="#6EE7B7" />
            </g>
          </svg>
        </div>

        <div className="p-10 md:p-12 lg:p-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center shadow-xl">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Thank you{userName ? `, ${userName}` : ""}!</h1>
              <p className="mt-2 text-gray-600 text-sm md:text-base">Your registration is complete. We're excited to have you as part of our team.</p>

              <div className="mt-6 inline-flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <div className="text-xs text-gray-500">Assigned email</div>
                <div className="ml-3 font-medium text-gray-800 truncate max-w-xs">{localAssignedEmail || "(no assigned email)"}</div>
                <button
                 onClick={handleCopy}
                  className="ml-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-gray-200 bg-white hover:shadow-sm text-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="9" width="11" height="11" rx="2" stroke="#111827" strokeWidth="1.2" />
                    <rect x="4" y="4" width="11" height="11" rx="2" stroke="#111827" strokeWidth="1.2" />
                  </svg>
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

             

              <div className="mt-6 text-xs text-gray-400">
                 <div>Role: <span className="text-gray-700 font-medium">{localRole}</span></div>
                <div className="mt-1">Note: This assigned email (<span className="font-medium">{localAssignedEmail || "—"}</span>) is reserved for you. Keep it safe — you can use it to login or be added to company systems.</div>
              </div>
            </div>
          </div>

          {/* Decorative grid / info cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="text-xs text-gray-500">What's next</div>
              <div className="mt-2 font-medium text-gray-800">Onboarding & Access</div>
              <p className="mt-1 text-sm text-gray-600">We'll email you next steps for onboarding and how to access internal tools using your assigned email.</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="text-xs text-gray-500">Need help?</div>
              <div className="mt-2 font-medium text-gray-800">Contact support</div>
              <p className="mt-1 text-sm text-gray-600">If something looks off, reply to the invite email or contact <span className="font-medium">support@example.com</span>.</p>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">© {new Date().getFullYear()} SH. All rights reserved.</div>
        </div>

        {/* Subtle confetti decorations (pure CSS/HTML) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <motion.span
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute left-6 top-6 w-2 h-2 rounded-full bg-amber-400 opacity-90"
          />
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="absolute right-10 top-24 w-2 h-2 rounded-full bg-pink-400 opacity-90"
          />
          <motion.span
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="absolute left-28 bottom-16 w-2 h-2 rounded-full bg-sky-400 opacity-90"
          />
        </div>
      </motion.div>
    </div>
  );
}
