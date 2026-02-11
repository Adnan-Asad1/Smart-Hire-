import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch } from "react-icons/fi";
import { RiFileList3Line } from "react-icons/ri";
import { BsPeople } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import Tooltip from "@mui/material/Tooltip";
import HRLeftSideBar from "./HRLeftSideBar";
const generateId = () => Math.random().toString(36).slice(2, 9);



const Badge = ({ children, className = "" }) => (
  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${className}`}>{children}</span>
);

export default function HRProjectsTasksPage() {
 const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]); // fetched from backend

  // UI state
  const [query, setQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);
  const [isViewProjectOpen, setViewProjectOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [isAddTaskOpen, setAddTaskOpen] = useState(false);
const [isEditProjectOpen, setEditProjectOpen] = useState(false);
const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [deleteTarget, setDeleteTarget] = useState(null);

// date ko format karne ke liye helper
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return dateStr.split("T")[0]; // sirf YYYY-MM-DD return karega
};


// 🔹 Normalize employee object
const normalizeEmployee = (emp, employeesList = []) => {
  if (!emp) return { _id: "NA", name: "NA" };

  if (typeof emp === "string") {
    return employeesList.find((e) => String(e._id) === String(emp)) || { _id: emp, name: "NA" };
  }

  return emp;
};





  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please login again.");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/project/my-projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setProjects(res.data.projects);
      } else {
        toast.error(res.data.message || "Failed to load projects");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  fetchProjects();
}, []);

  // form state for create project
  const [newProject, setNewProject] = useState({ name: "", description: "", startDate: "", endDate: "", priority: "Medium", employees: [] });

  // ref for name input to keep focus in modal
  const nameRef = useRef(null);

  useEffect(() => {
    // fetch employees from backend
    let mounted = true;
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees/getEmployees"); // your backend route
        if (mounted && res?.data?.employees) setEmployees(res.data.employees);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }
    };
    fetchEmployees();
    return () => (mounted = false);
  }, []);

  // helper: find employee by _id or full object
const getEmployeeById = (empOrId) => {
  if (!empOrId) return { name: "—" };

  // agar directly employee object aa gaya
  if (typeof empOrId === "object" && empOrId.name) {
    return empOrId;
  }

  // otherwise id ke through dhoondo
  return employees.find((e) => String(e._id || e.id) === String(empOrId)) || { name: "Unknown" };
};


  const getProjectProgress = (p) => {
    if (!p.tasks || p.tasks.length === 0) return 0;
    const done = p.tasks.filter((t) => t.status === "Completed").length;
    return Math.round((done / p.tasks.length) * 100);
  };

const handleCreateProject = async (project) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized! Please login again.");
      return;
    }

    const res = await axios.post("http://localhost:5000/api/project/createProject", project, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      toast.success("Project created successfully!");
      setCreateProjectOpen(false);

      // ✅ Refresh projects from backend
      const refreshed = await axios.get("http://localhost:5000/api/project/my-projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(refreshed.data.projects);
    } else {
      toast.error(res.data.message || "Failed to create project");
    }
  } catch (error) {
    console.error("Error creating project:", error);
    toast.error(error.response?.data?.message || "Server error");
  }
};



const handleDeleteProject = async () => {
  if (!deleteTarget) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized! Please login again.");
      return;
    }

    const res = await axios.delete(
      `http://localhost:5000/api/project/delete/${deleteTarget._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      toast.success("Project deleted successfully!");
      setProjects((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } else {
      toast.error(res.data.message || "Failed to delete project");
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    toast.error(error.response?.data?.message || "Server error");
  }
};



const handleAddTask = async (projectId, task) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized! Please login again.");
      return;
    }

    const res = await axios.post(
      `http://localhost:5000/api/project/${projectId}/addTask`,
      task,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      const updatedProject = {
        ...res.data.project,
        employees: res.data.project.employees.map((emp) =>
          normalizeEmployee(emp, employees) // ✅ normalize employees
        ),
      };

      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );
      setAddTaskOpen(false);
      // toast.success("Task added successfully!");
    } else {
      toast.error(res.data.message || "Failed to add task");
    }
  } catch (error) {
    console.error("Error adding task:", error);
    toast.error(error.response?.data?.message || "Server error");
  }
};



  const handleUpdateTaskStatus = (projectId, taskId, status) => {
    setProjects((prev) => prev.map((p) => p._id === projectId ? { ...p, tasks: p.tasks.map(t => t._id === taskId ? { ...t, status } : t) } : p));
    // TODO: PUT /api/tasks/:id
  };

  const handleDeleteTask = (projectId, taskId) => {
    if (!confirm("Delete this task?")) return;
    setProjects((prev) => prev.map((p) => p._id === projectId ? { ...p, tasks: p.tasks.filter(t => t._id !== taskId) } : p));
    // TODO: DELETE /api/tasks/:id
  };

  // ----- Filters / Search -----
  const filteredProjects = projects.filter((p) => {
    const q = query.trim().toLowerCase();
    if (filterPriority && p.priority !== filterPriority) return false;
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });

  // ----- Small UI components for Modals -----
function CreateProjectModal() {
  const [localProject, setLocalProject] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    employees: [],
  });
  const [error, setError] = useState("");
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus(); // autofocus
  }, []);

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (!localProject.name.trim()) {
      toast.error("Project name is required.");
      return;
    }
    if (!localProject.description.trim()) {
      toast.error("Description is required.");
      return;
    }

    if (!localProject.startDate || !localProject.endDate) {
      toast.error("Both start and end dates are required.");
      return;
    }

    if (!localProject.employees.length) {
      toast.error("At least one employee must be assigned to this project.");
      return;
    }

    if (new Date(localProject.endDate) < new Date(localProject.startDate)) {
      toast.error("End date cannot be before start date.");
      return;
    }

    handleCreateProject(localProject);
    // toast.success("Project created successfully!");
    setCreateProjectOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 animate-fadeIn ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h3 className="text-2xl font-bold text-gray-800">
            🚀 Create Project
          </h3>
          <button
            type="button"
            onClick={() => setCreateProjectOpen(false)}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Project Name
            </label>
            <input
              ref={nameRef}
              value={localProject.name}
              onChange={(e) =>
                setLocalProject({ ...localProject, name: e.target.value })
              }
              placeholder="E.g. AI Recruiter System"
              className="mt-2 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={localProject.description}
              onChange={(e) =>
                setLocalProject({
                  ...localProject,
                  description: e.target.value,
                })
              }
              placeholder="Write project details..."
              className="mt-2 w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={3}
              required
            />
          </div>

          {/* Dates + Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={localProject.startDate}
                onChange={(e) =>
                  setLocalProject({ ...localProject, startDate: e.target.value })
                }
                className="mt-2 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                type="date"
                min={localProject.startDate || today} // ✅ End must be >= start
                value={localProject.endDate}
                onChange={(e) =>
                  setLocalProject({ ...localProject, endDate: e.target.value })
                }
                className="mt-2 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Priority
              </label>
              <select
                value={localProject.priority}
                onChange={(e) =>
                  setLocalProject({ ...localProject, priority: e.target.value })
                }
                className="mt-2 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* Assign Employees */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Assign Employees
            </label>
            <div className="mt-2 border rounded-lg p-3 h-44 overflow-y-auto space-y-2 bg-gray-50">
              {employees.length === 0 && (
                <div className="text-gray-500 text-sm">
                  No employees found
                </div>
              )}
              {employees.map((emp) => (
                <label
                  key={emp._id || emp.id}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
                >
                  <input
                    type="checkbox"
                    checked={localProject.employees.includes(emp._id || emp.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setLocalProject({
                          ...localProject,
                          employees: [
                            ...localProject.employees,
                            emp._id || emp.id,
                          ],
                        });
                      } else {
                        setLocalProject({
                          ...localProject,
                          employees: localProject.employees.filter(
                            (id) => id !== (emp._id || emp.id)
                          ),
                        });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-gray-800">{emp.name}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select one or more employees
            </p>
          </div>

          {/* Error */}
          {error && <div className="text-red-600 text-sm">{error}</div>}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setCreateProjectOpen(false)}
              className="px-5 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FiPlus /> Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function EditProjectModal({ project }) {
  // ✅ Normalize employees -> sirf IDs
  const [localProject, setLocalProject] = useState({
    ...project,
    employees: project.employees.map((e) =>
      typeof e === "object" ? e._id || e.id : e
    ),
  });

  const today = new Date().toISOString().split("T")[0];

  const submit = async (e) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (new Date(localProject.endDate) < new Date(localProject.startDate)) {
      toast.error("End date cannot be before start date!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please login again.");
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/project/update/${project._id}`,
        localProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Project updated successfully!");
        setEditProjectOpen(false);

        // refresh projects list
        const refreshed = await axios.get(
          "http://localhost:5000/api/project/my-projects",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(refreshed.data.projects);
      } else {
        toast.error(res.data.message || "Failed to update project");
      }
    } catch (err) {
      console.error("Error updating project:", err);
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h3 className="text-2xl font-bold text-gray-800">
            ✏️ Edit Project
          </h3>
          <button
            type="button"
            onClick={() => setEditProjectOpen(false)}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Project Name
            </label>
            <input
              value={localProject.name}
              onChange={(e) =>
                setLocalProject({ ...localProject, name: e.target.value })
              }
              placeholder="Enter project name"
              className="mt-2 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={localProject.description}
              onChange={(e) =>
                setLocalProject({
                  ...localProject,
                  description: e.target.value,
                })
              }
              placeholder="Write project details..."
              className="mt-2 w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={3}
              required
            />
          </div>

          {/* Dates + Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={localProject.startDate?.split("T")[0]}
                onChange={(e) =>
                  setLocalProject({
                    ...localProject,
                    startDate: e.target.value,
                  })
                }
                className="mt-2 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                type="date"
                min={localProject.startDate?.split("T")[0] || today} // ✅ End must be >= start
                value={localProject.endDate?.split("T")[0]}
                onChange={(e) =>
                  setLocalProject({
                    ...localProject,
                    endDate: e.target.value,
                  })
                }
                className="mt-2 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Priority
              </label>
              <select
                value={localProject.priority}
                onChange={(e) =>
                  setLocalProject({
                    ...localProject,
                    priority: e.target.value,
                  })
                }
                className="mt-2 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* Assign Employees */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Assign Employees
            </label>
            <div className="mt-2 border rounded-lg p-3 h-44 overflow-y-auto space-y-2 bg-gray-50">
              {employees.length === 0 && (
                <div className="text-gray-500 text-sm">
                  No employees found
                </div>
              )}
              {employees.map((emp) => (
                <label
                  key={emp._id || emp.id}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
                >
                  <input
                    type="checkbox"
                    checked={localProject.employees.includes(
                      emp._id || emp.id
                    )}
                    onChange={(e) => {
                      const form = e.target.form;
                      const checkedIds = Array.from(
                        form.querySelectorAll("input[type=checkbox]:checked")
                      ).map((cb) => cb.value);

                      setLocalProject({
                        ...localProject,
                        employees: checkedIds,
                      });
                    }}
                    value={emp._id || emp.id}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-gray-800">{emp.name}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select one or more employees
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setEditProjectOpen(false)}
              className="px-5 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition flex items-center gap-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



function AddTaskModal({ project }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: project.employees?.[0] || "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });

  useEffect(() => {
    if (project?.employees?.length && !task.assignedTo) {
      setTask((t) => ({ ...t, assignedTo: project.employees[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.employees]);

  const submit = (e) => {
    e.preventDefault();

    if (!task.title.trim()) {
      toast.error("Task title is required.");
      return;
    }
    if (!task.description) {
      toast.error("Description is required");
      return;
    }
    if (!task.assignedTo) {
      toast.error("Please assign this task to a valid employee.");
      return;
    }
    if (!task.dueDate) {
      toast.error("Due date is required.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (task.dueDate < today) {
      toast.error("Due date cannot be in the past.");
      return;
    }

    if (!project.employees.length) {
      toast.error(
        "This project has no employees assigned. Please assign at least one employee before adding tasks."
      );
      return;
    }

    handleAddTask(project._id, task);
    toast.success("Task added successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 ">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 relative">
        

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Add Task to <span className="text-blue-600">"{project.name}"</span>
          </h3>
          <button
            type="button"
            onClick={() => setAddTaskOpen(false)}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          {/* Task Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">Task Title</label>
            <input
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="E.g. Implement authentication API"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              rows={3}
              placeholder="Write a short description..."
            />
          </div>

          {/* Assign Employee */}
          <div>
            <label className="text-sm font-medium text-gray-700">Assign Employee</label>
            <div className="relative">
              <select
                value={task.assignedTo}
                onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                size={project.employees.length > 5 ? 5 : project.employees.length || 1} // show 5 max
              >
                {project.employees.length === 0 && (
                  <option value="">No employees assigned to project</option>
                )}
                {project.employees.map((emp) => (
                  <option key={emp._id || emp.id} value={emp._id || emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date + Priority in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={() => setAddTaskOpen(false)}
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 shadow-md hover:bg-green-700 transition"
            >
              <FiPlus /> Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function ViewProjectModal({ project }) {
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // 🟢 New: State for Delete Confirmation Popup
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 🟢 Open Edit Modal
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setEditTaskOpen(true);
  };

  // 🟢 Update Task API Call (with validation + token)
const handleUpdateTask = async () => {
  // ✅ Validation
  if (!currentTask.title?.trim()) {
    toast.error("Task Title is required!");
    return;
  }
  if (!currentTask.description?.trim()) {
    toast.error("Task Description is required!");
    return;
  }
  if (!currentTask.assignedTo) {
    toast.error("Please assign this task to an employee!");
    return;
  }
  if (!currentTask.dueDate) {
    toast.error("Due Date is required!");
    return;
  }
  if (!currentTask.priority) {
    toast.error("Priority is required!");
    return;
  }
  if (!currentTask.status) {
    toast.error("Status is required!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized! Please login again.");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/project/updateTask/${project._id}/tasks/${currentTask._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentTask),
      }
    );

    const data = await res.json();
    if (data.success) {
      toast.success("✅ Task updated successfully");
      setEditTaskOpen(false);
    } else {
      toast.error("❌ " + (data.message || "Failed to update task"));
    }
  } catch (err) {
    console.error(err);
    toast.error("❌ Error updating task");
  }
};


  // 🟢 Delete Task API Call (with token)
  const handleDeleteTask = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/project/deleteTask/${project._id}/tasks/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Token added
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("✅ Task deleted successfully");
        setDeleteConfirmOpen(false);
        setDeleteTarget(null);
      } else {
        toast.error("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error deleting task");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pt-20 bg-black/40">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-8 ml-64 p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8 gap-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{project.name}</h3>
            <p className="text-base text-gray-600 mt-1">
              {project.description}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                {project.priority}
              </span>
              <div className="text-sm text-gray-500 font-medium">
                {formatDate(project.startDate)} → {formatDate(project.endDate)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-gray-500">Progress</span>
            <div className="w-48 bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                style={{ width: `${getProjectProgress(project)}%` }}
                className="h-3 bg-gradient-to-r from-green-400 to-blue-600 transition-all"
              ></div>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              {getProjectProgress(project)}%
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold text-gray-800">Tasks</h4>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setAddTaskOpen(true);
                setCurrentProject(project);
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition"
            >
              + Add Task
            </button>
            <button
              type="button"
              onClick={() => {
                setViewProjectOpen(false);
              }}
              className="px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>

        {/* Task Table with Scroll */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm max-h-96 overflow-y-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase sticky top-0 z-10">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Assigned</th>
                <th className="p-3">Due</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((t, index) => (
                <tr
                  key={t._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 font-medium text-gray-800">{t.title}</td>
                  <td className="p-3 text-gray-700">
                    {getEmployeeById(t.assignedTo)?.name}
                  </td>
                  <td className="p-3 text-gray-600">{formatDate(t.dueDate)}</td>
                  <td className="p-3">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3">{t.status}</td>
                  <td className="p-3 text-right flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditTask(t)}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteTarget(t);
                        setDeleteConfirmOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 text-sm shadow-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 Edit Task Modal */}
      {editTaskOpen && currentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">✏️ Edit Task</h3>
              <button
                type="button"
                onClick={() => setEditTaskOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                ✖
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateTask();
              }}
              className="space-y-5"
            >
              {/* Task Title */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Task Title
                </label>
                <input
                  value={currentTask.title}
                  onChange={(e) =>
                    setCurrentTask({ ...currentTask, title: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="E.g. Fix login bug"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={currentTask.description}
                  onChange={(e) =>
                    setCurrentTask({
                      ...currentTask,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  rows={3}
                  placeholder="Write task details..."
                />
              </div>

              {/* Assign Employee */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Assign Employee
                </label>
                <div className="relative">
                  <select
                    value={currentTask.assignedTo}
                    onChange={(e) =>
                      setCurrentTask({
                        ...currentTask,
                        assignedTo: e.target.value,
                      })
                    }
                    className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    size={
                      project.employees.length > 5
                        ? 5
                        : project.employees.length || 1
                    }
                  >
                    {project.employees.length === 0 && (
                      <option value="">No employees assigned</option>
                    )}
                    {project.employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date + Priority + Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={currentTask.dueDate?.substring(0, 10)}
                    onChange={(e) =>
                      setCurrentTask({ ...currentTask, dueDate: e.target.value })
                    }
                    className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    value={currentTask.priority}
                    onChange={(e) =>
                      setCurrentTask({ ...currentTask, priority: e.target.value })
                    }
                    className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={currentTask.status}
                    onChange={(e) =>
                      setCurrentTask({ ...currentTask, status: e.target.value })
                    }
                    className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setEditTaskOpen(false)}
                  className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
                >
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 Delete Confirmation Modal */}
      {deleteConfirmOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ⚠️ Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteTarget(null);
                }}
                className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* ✅ Left Sidebar */}
      <HRLeftSideBar />

      {/* ✅ Main Content */}
      <div className="flex-1  overflow-y-auto ml-64 p-6">
        <Toaster position="top-right" />
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
                <RiFileList3Line /> Projects & Tasks
              </h1>
              <p className="text-sm text-gray-500">
                Create projects, assign tasks & monitor progress.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects or description"
                  className="outline-none text-sm"
                />
              </div>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border rounded-lg p-2 bg-white text-sm"
              >
                <option value="">All priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <button
                type="button"
                onClick={() => setCreateProjectOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105"
              >
                <FiPlus /> New Project
              </button>
            </div>
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {p.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        p.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : p.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {p.priority}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      style={{ width: `${getProjectProgress(p)}%` }}
                      className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                    <div>{getProjectProgress(p)}% complete</div>
                    <div>
                      {formatDate(p.startDate)} → {formatDate(p.endDate)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {p.employees.slice(0, 3).map((empRaw) => {
                      const emp = normalizeEmployee(empRaw, employees);
                      const initials = emp?.name
                        ? emp.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                        : "NA";

                      return (
                        <Tooltip key={emp._id} title={emp?.name || "Unknown"}>
                          <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold border border-white shadow-sm cursor-pointer">
                            {initials}
                          </div>
                        </Tooltip>
                      );
                    })}

                    {p.employees.length > 3 && (
                      <Tooltip
                        title={p.employees
                          .slice(3)
                          .map(
                            (empRaw) =>
                              normalizeEmployee(empRaw, employees)?.name ||
                              "Unknown"
                          )
                          .join(", ")}
                      >
                        <div className="w-9 h-9 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold border border-white shadow-sm cursor-pointer">
                          +{p.employees.length - 3}
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentProject(p);
                        setViewProjectOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentProject(p);
                        setEditProjectOpen(true);
                      }}
                      className="px-3 py-1 border rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteTarget(p);
                        setDeleteConfirmOpen(true);
                      }}
                      className="px-3 py-1 border rounded-lg text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No projects match your search / filters.
            </div>
          )}
        </div>

        {/* Modals */}
        {isCreateProjectOpen && <CreateProjectModal />}
        {isViewProjectOpen && currentProject && (
          <ViewProjectModal project={currentProject} />
        )}
        {isAddTaskOpen && currentProject && (
          <AddTaskModal project={currentProject} />
        )}

        {/* ✅ Edit project modal render */}
        {isEditProjectOpen && currentProject && (
          <EditProjectModal project={currentProject} />
        )}

        {/* ✅ Delete confirm modal */}
        {deleteConfirmOpen && deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative text-center animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ⚠️ Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete project{" "}
                <span className="font-semibold text-red-600">
                  {deleteTarget.name}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setDeleteTarget(null);
                  }}
                  className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );


}
