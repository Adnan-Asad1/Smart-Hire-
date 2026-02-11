import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // store role: "admin" | "hr" | "employee"
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);
  const navigate = useNavigate();

  // ✅ Check token & role on mount
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const token = localStorage.getItem("token");
    const employeeToken = localStorage.getItem("employeeToken");

    if (adminToken) {
      setIsLoggedIn(true);
      setRole("admin");
    } else if (employeeToken) {
      setIsLoggedIn(true);
      setRole("employee");
    }else if (token) {
      setIsLoggedIn(true);
      setRole("hr");
    }  else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("role"); // in case role bhi save ho
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
    window.location.reload();
  };

  // ✅ Get dashboard link by role
  const getDashboardLink = () => {
    switch (role) {
      case "admin":
        return "/AdminDashboard";
      case "hr":
        return "/DashBoard";
      case "employee":
        return "/EmployeeDashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white relative">
      <div className="text-2xl font-bold text-blue-600">AI Recruiter</div>

      <ul className="flex space-x-6 text-gray-700">
        <li><Link to="/">Home</Link></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="relative">
        {!isLoggedIn ? (
          <>
            {/* LOGIN DROPDOWN */}
            <div className="inline-block relative mr-2">
              <button
                onClick={() => {
                  setShowLoginDropdown(!showLoginDropdown);
                  setShowSignupDropdown(false);
                }}
                className="px-4 py-2 border rounded hover:bg-blue-600 hover:text-white"
              >
                Login
              </button>
              {showLoginDropdown && (
                <ul className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                  <li>
                    <Link
                      to="/AdminLogin"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login as Admin
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/Login?role=hr"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login as HR
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/EmployeeLogin"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login as Employee
                    </Link>
                  </li>
                </ul>
              )}
            </div>

           
          </>
        ) : (
          <>
            <Link to={getDashboardLink()}>
              <button className="px-4 py-2 border rounded hover:bg-blue-600 hover:text-white mr-2">
                Dashboard
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border rounded hover:bg-red-600 hover:text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
