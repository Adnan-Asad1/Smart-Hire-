import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import {
  FaProjectDiagram,
  FaTasks,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import EmployeeLeftSideBar from "./EmployeeLeftSideBar"; // 🔹 Predefined Sidebar Component
import Tooltip from "@mui/material/Tooltip";

const EmployeeProjectsTasks = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Popup states
  const [selectedProject, setSelectedProject] = useState(null); // For tasks popup
  const [selectedTask, setSelectedTask] = useState(null); // For description popup

  // 🔹 Fetch Projects & Tasks from Backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("employeeToken");
        if (!token) {
          console.error("No employee token found in localStorage!");
          return;
        }

        const { data } = await axios.get(
          "http://localhost:5000/api/project/getEmployeeProjectsAndTasks", // 🔹 Update with your backend route
          {
            headers: {
              Authorization: `Bearer ${token}`, // 🔑 Send Token for Auth
            },
          }
        );

        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // 🔎 Search + Filter logic
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = proj.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 📊 Quick Overview Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "Active").length;
  const completedProjects = projects.filter(
    (p) => p.status === "Completed"
  ).length;
  const onHoldProjects = projects.filter((p) => p.status === "On Hold").length;

  const allTasks = projects.flatMap((p) => p.tasks);
  const activeTasks = allTasks.filter(
    (t) => t.status === "Pending" || t.status === "In Progress"
  ).length;
  const completedTasks = allTasks.filter((t) => t.status === "Completed").length;
  const overdueTasks = allTasks.filter(
    (t) =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Completed"
  ).length;

  return (
    <div className="flex min-h-screen bg-gray-100">
  {/* Sidebar (Fixed) */}
  <div className="w-64 fixed left-0 top-0 h-screen bg-white shadow-lg z-40">
    <EmployeeLeftSideBar />
  </div>

  {/* Main Content (Scrollable) */}
  <div className="flex-1 ml-64 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            My Projects
          </h1>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* 🔹 Quick Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Projects */}
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow">
                <FaProjectDiagram size={22} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Projects
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {totalProjects}
                </p>
              </div>
            </div>
            <p className="text-xs mt-3 text-gray-500">
              Active: {activeProjects} | Completed: {completedProjects} | On
              Hold: {onHoldProjects}
            </p>
          </div>

          {/* Active Tasks */}
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow">
                <FaTasks size={22} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Active Tasks
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {activeTasks}
                </p>
              </div>
            </div>
            <p className="text-xs mt-3 text-gray-500">
              Pending + In Progress
            </p>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow">
                <FaCheckCircle size={22} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Completed Tasks
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-600 text-white shadow">
                <FaExclamationTriangle size={22} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Overdue Tasks
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {overdueTasks}
                </p>
              </div>
            </div>
            <p className="text-xs mt-3 text-gray-500">Deadline passed</p>
          </div>
        </div>

        {/* Projects List */}
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">

        {filteredProjects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
              >
                {/* Project Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {project.name}
                    </h2>
                    <p className="text-sm text-gray-500 truncate max-w-md">
                      {project.description}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      project.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : project.status === "Completed"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Dates & Priority */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span>
                    <strong>Start:</strong>{" "}
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                  <span>
                    <strong>End:</strong>{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      project.priority === "High"
                        ? "bg-red-100 text-red-600"
                        : project.priority === "Medium"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {project.priority}
                  </span>
                </div>

                {/* Assigned Employees */}
                <div className="mt-3 flex -space-x-2">
                  {project.employees.slice(0, 3).map((emp, idx) => {
                    const initials = emp.name
                      .split(" ")
                      .map((n) => n[0]?.toUpperCase())
                      .join("");

                    return (
                      <Tooltip key={idx} title={emp.name} arrow placement="top">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs border-2 border-white cursor-pointer">
                          {initials}
                        </div>
                      </Tooltip>
                    );
                  })}

                  {/* Agar 3 se zyada employees hain to +X show karo */}
                  {project.employees.length > 3 && (
                    <Tooltip
                      title={
                        <div>
                          {project.employees.slice(3).map((emp, i) => (
                            <div key={i}>{emp.name}</div>
                          ))}
                        </div>
                      }
                      arrow
                      placement="top"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xs border-2 border-white cursor-pointer">
                        +{project.employees.length - 3}
                      </div>
                    </Tooltip>
                  )}
                </div>

               {/* View Tasks Button */}
<button
  onClick={() => setSelectedProject(project)}
  className="mt-5 flex items-center gap-2 px-4 py-2 text-sm font-medium 
             text-white bg-gradient-to-r from-blue-500 to-indigo-600 
             rounded-lg shadow hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 
             transition-all duration-300"
>
  View Tasks
</button>

              </div>
            ))}
          </div>
        )}
</div>
{/* 🔹 Popup Modal for Tasks */}
{selectedProject && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-2xl w-full max-w-6xl p-8 relative border border-gray-200">
      {/* Close Button */}
      <button
        onClick={() => setSelectedProject(null)}
        className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors text-2xl font-bold"
      >
        ✕
      </button>

      {/* Header */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
          <span className="text-indigo-600">📋</span>
          {selectedProject.name} – Tasks
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Stay on top of project progress with clear task statuses and deadlines
        </p>
      </div>

      {/* No Tasks */}
      {selectedProject.tasks.length === 0 ? (
        <p className="text-gray-500 text-center text-lg py-12 font-medium">
          🚀 No tasks assigned yet.
        </p>
      ) : (
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto custom-scrollbar">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Task Title
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Priority
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedProject.tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50/80`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {task.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md
                        ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : task.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md
                        ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-600 border border-red-200"
                            : task.priority === "Medium"
                            ? "bg-blue-100 text-blue-600 border border-blue-200"
                            : "bg-green-100 text-green-600 border border-green-200"
                        }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200"
                    >
                      View Details
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
)}



        {/* 🔹 Popup Modal for Task Description */}
        {selectedTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedTask(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {selectedTask.title} - Description
              </h3>

              <div className="text-gray-700 whitespace-pre-line max-h-[50vh] overflow-y-auto">
                {selectedTask.description || "No description available."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProjectsTasks;
