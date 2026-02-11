import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const EmployeeRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Token from URL (invite link)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    experience: "",
    skills: "",
    password: "",
  });

  // Token & Invite validation states
  const [loadingValidate, setLoadingValidate] = useState(!!token);
  const [tokenValid, setTokenValid] = useState(null);
  const [invalidReason, setInvalidReason] = useState("");
  const [emailLocked, setEmailLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
const [confirmChecked, setConfirmChecked] = useState(false);


  // ✅ Token Validation (same as HR page)
  useEffect(() => {
    if (!token) {
      setLoadingValidate(false);
      setTokenValid(null);
      setEmailLocked(false);
      return;
    }

    let mounted = true;

    const validateToken = async () => {
      try {
        setLoadingValidate(true);
        const res = await axios.get(`http://localhost:5000/api/invites/validate/${token}`);
        if (!mounted) return;

        if (res.data?.valid) {
          setTokenValid(true);

          const assigned = res.data?.invite?.assignedEmail;
          if (assigned) {
            setFormData(prev => ({ ...prev, email: assigned }));
            setEmailLocked(true);
          } else {
            setEmailLocked(false);
          }
        } else {
          setTokenValid(false);
          setInvalidReason(res.data?.reason || "Invalid or expired invite link");
        }
      } catch (err) {
        if (!mounted) return;
        const msg = err.response?.data?.reason || err.response?.data?.message || "Invalid or expired invite token";
        setTokenValid(false);
        setInvalidReason(msg);
      } finally {
        if (mounted) setLoadingValidate(false);
      }
    };

    validateToken();
    return () => {
      mounted = false;
    };
  }, [token]);

  // ✅ Input Change
  const handleChange = (e) => {
    if (emailLocked && e.target.name === "email") return; // prevent editing locked email
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Basic validation
  for (let key in formData) {
    if (!formData[key].trim()) {
      toast.error("Please fill all fields!");
      return;
    }
  }



  setSubmitting(true);

  try {
    const body = { ...formData };
    if (token) body.token = token;

    const res = await axios.post("http://localhost:5000/api/employees/register", body);

    toast.success(res.data.message || "Employee registered successfully!");
    localStorage.setItem("assignedEmail", formData.email);
    localStorage.setItem("role", formData.designation);
    navigate("/ThankYouPageRegistration");
  } catch (err) {
    toast.error(err.response?.data?.message || "Registration failed, try again!");
    if (
      err.response?.data?.message?.toLowerCase().includes("invite") ||
      err.response?.data?.message?.toLowerCase().includes("token")
    ) {
      setTokenValid(false);
      setInvalidReason(err.response?.data?.message);
    }
  } finally {
    setSubmitting(false);
  }
};




  // Disable form when validating or invalid
  const formDisabled = loadingValidate || (token && tokenValid === false);

  // ✅ Show loading state while validating
  if (token && loadingValidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12a9 9 0 11-6.219-8.485" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Validating invitation</h3>
              <p className="text-sm text-gray-500">Checking the invite link — please wait a moment.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Invalid token UI
  if (token && tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-10 flex flex-col items-center text-center gap-6">
            <div className="flex items-center justify-center w-28 h-28 rounded-full bg-rose-50 border border-rose-100 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12A9 9 0 1112 3a9 9 0 019 9z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Invitation Link Unavailable</h1>
            <p className="text-gray-600 max-w-lg">
              The registration link you used is not valid. It may have{" "}
              <span className="font-semibold text-rose-600">expired</span> or been{" "}
              <span className="font-semibold text-rose-600">already used</span>.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-rose-50 border border-rose-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
              </svg>
              <div className="text-sm text-rose-700">
                <span className="font-medium">Reason:</span> {invalidReason || "Link expired or already used."}
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-prose">
              Ask your administrator to resend a new invite or verify your company link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main registration UI (existing design preserved)
  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-8">
<div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-gray-100 hover:shadow-blue-100 transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Employee Registration</h2>
        <p className="text-center text-gray-500 mb-6">
          Please fill in all fields to create your employee account
        </p>

        {token && tokenValid === true && (
          <div className="mb-4 p-3 rounded border border-blue-100 bg-blue-50 text-blue-800 text-sm text-center">
            ✅ Invite verified — this registration was created for your company email.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={formDisabled}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl focus:outline-none ${
                emailLocked ? "border-gray-300 bg-gray-100 text-gray-700" : "focus:ring-2 focus:ring-blue-500"
              }`}
              required
              disabled={formDisabled || emailLocked}
              readOnly={emailLocked}
            />
            {emailLocked && (
              <p className="text-xs text-gray-500 mt-1">
                This email is assigned by your company and cannot be changed.
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Designation</label>
            <input
              type="text"
              name="designation"
              placeholder="e.g. Software Engineer"
              value={formData.designation}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={formDisabled}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Experience</label>
            <input
              type="text"
              name="experience"
              placeholder="e.g. 2 years, Fresher, 5+ years"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={formDisabled}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. React, Node.js, MongoDB"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={formDisabled}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={formDisabled}
            />
          </div>

<div className="mt-6 flex items-center gap-3">
  <label htmlFor="confirm" className="flex items-center gap-3 cursor-pointer group select-none">
    <div className="relative">
      <input
        type="checkbox"
        id="confirm"
        checked={confirmChecked}
        required
        onChange={(e) => setConfirmChecked(e.target.checked)}
        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md transition-all duration-200 cursor-pointer 
                   checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-200"
      />
      <svg
        className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <span className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
      I confirm that the above information is correct and cannot be edited later.
    </span>
  </label>
</div>




          <button
            type="submit"
            className={`w-full ${
              formDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-3 rounded-xl font-semibold shadow-md transition`}
            disabled={formDisabled || submitting}
          >
            {submitting ? "Registering..." : "Register Employee"}
          </button>
        </form>
 

      </div>
    </div>
  );
};

export default EmployeeRegistration;
