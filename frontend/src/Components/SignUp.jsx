import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // grab token from URL if present

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    hrRole: '',
    experience: '',
    skills: '',
    password: '',
    confirmPassword: '',
  });

  const [loadingValidate, setLoadingValidate] = useState(!!token);
  const [tokenValid, setTokenValid] = useState(null); // null = unknown, true = valid, false = invalid
  const [invalidReason, setInvalidReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false); // true when assignedEmail is present & should be readonly
const [confirmChecked, setConfirmChecked] = useState(false);

  useEffect(() => {
    // If there's no token, skip validation and allow normal registration
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

          // If server provided assignedEmail (reservation-on-create flow),
          // set it into the form and lock it so user can't edit it.
          const assigned = res.data?.invite?.assignedEmail;
          if (assigned) {
            setFormData(prev => ({ ...prev, email: assigned }));
            setEmailLocked(true);
          } else {
            // keep email editable if server didn't provide assigned email
            setEmailLocked(false);
          }
        } else {
          setTokenValid(false);
          setInvalidReason(res.data?.reason || 'Invite invalid');
          setEmailLocked(false);
        }
      } catch (err) {
        if (!mounted) return;
        const msg = err.response?.data?.reason || err.response?.data?.message || 'Invalid/expired invite token';
        setTokenValid(false);
        setInvalidReason(msg);
        setEmailLocked(false);
      } finally {
        if (mounted) setLoadingValidate(false);
      }
    };

    validateToken();
    return () => { mounted = false; };
  }, [token]);

  const handleChange = (e) => {
    // prevent editing email when locked
    if (emailLocked && e.target.name === 'email') return;
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = (e) => {
  e.preventDefault();


  const { fullName, email, hrRole, experience, skills, password, confirmPassword } = formData;

 if (password !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }


  if (!confirmChecked) {
    setFormError("Please confirm that all the above information is correct before submitting.");
    return;
  }

  confirmAndSubmit();
};


const confirmAndSubmit = async () => {
  setSubmitting(true);

  try {
    const { fullName, email, hrRole, experience, skills, password } = formData;
    const body = { fullName, email, hrRole, experience, skills, password };
    if (token) body.token = token;

    await axios.post("http://localhost:5000/api/auth/register", body);
    toast.success("Registration successful!");

    localStorage.setItem("assignedEmail", formData.email);
    localStorage.setItem("role", formData.hrRole);
    navigate("/ThankYouPageRegistration");
  } catch (err) {
    const msg = err.response?.data?.message || "Registration failed";
    toast.error(msg);

    if (msg.toLowerCase().includes("invite") || msg.toLowerCase().includes("token")) {
      setTokenValid(false);
      setInvalidReason(msg);
    }
  } finally {
    setSubmitting(false);
  }
};

  // Disable form if still validating or if token exists and is invalid
  const formDisabled = loadingValidate || (token && tokenValid === false);

  // ---------- Prevent "flash" of form while validating ----------
  // Show a centered validation-loading card when we're validating token
  if (token && loadingValidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12a9 9 0 11-6.219-8.485" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Validating invitation</h3>
              <p className="text-sm text-gray-500">Checking the invite link — please wait a moment.</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-4/6" />
            <div className="h-10 bg-gray-100 rounded w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  // ---------- Invalid token UI (full page) ----------
  if (token && tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-10 flex flex-col items-center text-center gap-6">
            {/* decorative round icon */}
            <div className="flex items-center justify-center w-28 h-28 rounded-full bg-rose-50 border border-rose-100 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12A9 9 0 1112 3a9 9 0 019 9z"/>
              </svg>
            </div>

            {/* title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Invitation Link Unavailable
            </h1>

            {/* subtitle */}
            <p className="text-gray-600 max-w-lg">
              The registration link you used is not valid. This usually means the link has <span className="font-semibold text-rose-600">already been used</span> or has <span className="font-semibold text-rose-600">expired</span>.
            </p>

            {/* reason badge */}
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-rose-50 border border-rose-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
              </svg>
              <div className="text-sm text-rose-700">
                <span className="font-medium">Reason:</span> {invalidReason || 'Link expired or already used.'}
              </div>
            </div>

            {/* explanatory text */}
            <p className="text-sm text-gray-500 max-w-prose">
              If you think this is a mistake, please ask your administrator to generate a new invitation or confirm you opened the correct link.
            </p>

            {/* support contact */}
            <div className="text-xs text-gray-400">
              Need help? <a href="mailto:support@yourcompany.com" className="text-gray-600 underline">support@yourcompany.com</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Main registration form (token absent or valid) ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create an Account</h2>
        <p className="text-center text-gray-500 mb-4">Join AI Recruiter today</p>

        {token && tokenValid === true && (
          <div className="mb-4 p-3 rounded border border-blue-100 bg-blue-50 text-blue-800">
            <strong>Invite verified:</strong> This registration was created for your company email.
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={formDisabled}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${emailLocked ? 'border-gray-300 bg-gray-100 text-gray-700' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
              disabled={formDisabled || emailLocked}
              readOnly={emailLocked}
            />
            {emailLocked && (
              <p className="mt-2 text-xs text-gray-500">
                This email is assigned by your company and cannot be changed.
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">HR Role</label>
            <input
              type="text"
              name="hrRole"
              value={formData.hrRole}
              onChange={handleChange}
              placeholder="HR Manager"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={formDisabled}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. Fresh, 2 years, 5+ years"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={formDisabled}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Recruitment, Training, Payroll"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={formDisabled}
            />
            <p className="text-xs text-gray-400 mt-1">Enter multiple skills separated by commas</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={formDisabled}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={formDisabled}
            />
          </div>
{/* Confirmation Checkbox */}
<div className="mt-4 flex items-start gap-3">
  <label htmlFor="confirm" className="flex items-center gap-3 cursor-pointer select-none group">
    <div className="relative">
      <input
        type="checkbox"
        id="confirm"
        checked={confirmChecked}
        required
        onChange={(e) => setConfirmChecked(e.target.checked)}
        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md transition-all duration-200 cursor-pointer
                   checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      />
      <svg
        className="absolute top-[3px] left-[3px] w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <span className="text-sm text-gray-700 group-hover:text-blue-700 transition">
      I confirm that the above information is correct and cannot be edited later.
    </span>
  </label>
</div>


          <button
            type="submit"
            className={`w-full ${formDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded-lg font-semibold transition`}
            disabled={formDisabled || submitting}
          >
            {submitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

       
      </div>

 

    </div>
  );
};

export default SignUp;
