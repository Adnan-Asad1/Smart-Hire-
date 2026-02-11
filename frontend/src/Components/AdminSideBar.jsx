import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { MdDashboard, MdSettings } from "react-icons/md";
import {
  FaUsers,
  FaClipboardList,
  FaChartLine,
  FaShieldAlt,
  FaUserPlus
} from "react-icons/fa";

const AdminSideBar = () => {
  // Collapsible states
  const [openRequests, setOpenRequests] = useState(false);
  const [openHR, setOpenHR] = useState(false);
  const [openEmployee, setOpenEmployee] = useState(false);
  const [openInterview, setOpenInterview] = useState(false);
  const [openReports, setOpenReports] = useState(false);
  const [openSecurity, setOpenSecurity] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <div className="w-64 bg-white shadow-2xl px-6 py-8 rounded-tr-3xl rounded-br-3xl border-r border-blue-100 min-h-screen flex flex-col">
      {/* Logo */}
      <h1 className="text-2xl font-extrabold text-blue-700 mb-10 tracking-wide text-center">
        Admin Panel
      </h1>

      {/* Sidebar Links */}
      <ul className="space-y-3 text-gray-700 text-[15px] font-medium flex-1">
        {/* Dashboard */}
        <li>
          <Link
            to="/AdminDashboard"
            className="flex items-center px-2 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <MdDashboard className="mr-3 text-lg shrink-0" /> Dashboard
          </Link>
        </li>

{/* 🆕 Registration Invites */}
        <li>
          <Link to="/AdminRegistrationInvite">
            <button
              className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              <span className="flex items-center">
                <FaUserPlus className="mr-2 shrink-0" /> Registration Invites
              </span>
            </button>
          </Link>
        </li>

        {/* HR Management */}
        <li>
          <Link to="/AdminHR">
          <button
           
            className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <span className="flex items-center">
              <FaUsers className="mr-2 shrink-0" /> HR Management
            </span>
          </button>
          </Link>
        </li>

        {/* Employee Management */}
        <li>
          <Link to="/AdminEmployees">
          <button
           
            className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <span className="flex items-center">
              <FaUsers className="mr-2 shrink-0" /> Employee Management
            </span>
          </button>
          </Link>
        </li>

        {/* Interview Overview */}
        <li>
          <Link to="/AdminInterviews">
          <button
            className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <span className="flex items-center">
              <FaClipboardList className="mr-2 shrink-0" /> Interview Overview
            </span>
          </button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSideBar;
