import React from "react";
import { FaCalendarAlt, FaClipboardList, FaCog } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaBrain } from "react-icons/fa";

const HRLeftSideBar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 rounded-tr-3xl rounded-br-3xl font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50 z-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-2xl px-6 py-8 rounded-tr-3xl rounded-br-3xl border-r border-blue-100 h-full overflow-y-auto">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-12">
          AI Recruiter
        </h1>

        <Link to="/generateQuestion">
          <button className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-xl w-full mb-10 text-sm font-semibold shadow-lg transition duration-300">
            <IoMdAdd className="mr-2 text-xl" />
            Create New Interview
          </button>
        </Link>

        <ul className="space-y-5 text-gray-700 text-[15px] font-medium">

          <Link to="/DashBoard"
          className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
          >   
          <li className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
            <MdDashboard className="mr-3 text-lg" /> Dashboard
          </li>
          </Link>

          <Link
            to="/InterviewDetail"
            className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
          >
            <li className="flex items-center">
              <FaCalendarAlt className="mr-3 text-lg" /> Scheduled Interviews
            </li>
          </Link>

          <Link
            to="/AllCreatedInterviews"
            className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
          >
            <li className="flex items-center">
              <FaClipboardList className="mr-3 text-lg" /> All Interviews
            </li>
          </Link>

          <Link
            to="/getAllEmployees"
            className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
          >
            <li className="flex items-center">
              <FaUsers className="mr-3 text-lg" /> View All Employees
            </li>
          </Link>

          <Link
            to="/ProjectDsecription"
            className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
          >
            <li className="flex items-center">
              <FaProjectDiagram className="mr-3 text-lg" /> Create Project Team
            </li>
          </Link>



<Link
  to="/HRProjectsPage"
  className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
>
  <li className="flex items-center">
    <FaTasks className="mr-3 text-lg" /> Projects & Tasks
  </li>
</Link>

          <Link
            to="/PendingLeaves"
            className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
          >
            <li className="flex items-center">
              <FaRegCalendarCheck className="mr-3 text-lg" /> Pending Leaves
            </li>
          </Link>




<Link
            to="/HRDocumentsPage"
            className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
          >
            <li className="flex items-center">
              <FiFileText className="mr-3 text-lg" /> Manage Documents
            </li>
          </Link> 



<Link
  to="/HRTrainingPage"
  className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
>
  <li className="flex items-center">
    <FaChalkboardTeacher className="mr-3 text-lg" /> HR Trainings
  </li>
</Link>

<Link
  to="/PredictInterview"
  className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
>
  <li className="flex items-center">
    <FaBrain className="mr-3 text-lg" /> Resume Matcher (AI)
  </li>
</Link>

          <Link
            to="/Billing"
            className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
          >
            <li className="flex items-center">
              <span className="mr-3 text-lg">💳</span> Billing
            </li>
          </Link>

          <li className="flex items-center cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-200">
            <FaCog className="mr-3 text-lg" /> Settings
          </li>
        </ul>
      </div>

     
    </div>
  );
};

export default HRLeftSideBar;
