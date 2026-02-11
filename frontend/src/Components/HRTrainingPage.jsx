import React, { useState,useEffect } from "react";
import HRLeftSideBar from "./HRLeftSideBar";
// ✅ Icon imports at top of your file:
import { Plus, Pencil, Trash2, X, Users, BookOpen, CheckCircle, Activity } from "lucide-react";
import axios from "axios";
const HRTrainingPage = () => {
  const [showModal, setShowModal] = useState(false);
 const [trainings, setTrainings] = useState([]);

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [trainingToDelete, setTrainingToDelete] = useState(null);
const [isEditMode, setIsEditMode] = useState(false);
const [trainingToEdit, setTrainingToEdit] = useState(null);

 const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Online",
    trainerName: "",
    trainerEmail: "",
    startDate: "",
    endDate: "",
    duration: "",
    mode: "",
    department: "",
    assignedEmployees: [],
    resources: [],
    links: [""],
  });


  const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ✅ Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees/getEmployees");
        setEmployees(res.data.employees || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

useEffect(() => {
  const fetchTrainings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        return;
      }

      // ✅ Backend se data fetch kar rahe hain (HR ke trainings)
      const res = await axios.get("http://localhost:5000/api/trainings/my-trainings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setTrainings(res.data.data); // 👈 backend ke data ko frontend state mein store kar do
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (err) {
      console.error("Error fetching trainings:", err);
      alert("❌ Failed to load trainings: " + err.message);
    }
  };

  fetchTrainings();
}, []);


  // Calculate difference in days (inclusive of start date)
const calcDurationDays = (start, end) => {
  if (!start || !end) return "";
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s) || isNaN(e) || e < s) return "";
  // difference in ms
  const diffMs = e.setHours(0,0,0,0) - s.setHours(0,0,0,0);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive
  return `${days} Day${days > 1 ? "s" : ""}`;
};


const handleDateChange = (field, value) => {
  setFormData((prev) => {
    const newData = { ...prev, [field]: value };
    // auto calculate duration when both dates exist
    const duration = calcDurationDays(newData.startDate, newData.endDate);
    newData.duration = duration;
    return newData;
  });
};
const handleEmployeeToggle = (id) => {
  setFormData((prev) => {
    const alreadySelected = prev.assignedEmployees.includes(id.toString());
    return {
      ...prev,
      assignedEmployees: alreadySelected
        ? prev.assignedEmployees.filter((empId) => empId !== id.toString())
        : [...prev.assignedEmployees, id.toString()],
    };
  });
};


  const handleSelectAll = () => {
    if (formData.assignedEmployees.length === employees.length) {
      setFormData({ ...formData, assignedEmployees: [] });
    } else {
      setFormData({ ...formData, assignedEmployees: employees.map((e) => e._id) });
    }
  };
const handleLinkChange = (index, value) => {
  setFormData((prev) => {
    const newLinks = [...prev.links];
    newLinks[index] = value;
    return { ...prev, links: newLinks };
  });
};

const addLinkField = () => {
  setFormData((prev) => ({ ...prev, links: [...prev.links, ""] }));
};


const handleSaveTraining = async () => {
  try {
    // simple validation
    const requiredFields = [
      { v: formData.title, name: "Title" },
      { v: formData.description, name: "Description" },
      { v: formData.startDate, name: "Start Date" },
      { v: formData.endDate, name: "End Date" },
      { v: formData.trainerName, name: "Trainer Name" },
      { v: formData.trainerEmail, name: "Trainer Email" },
    ];

    const missing = requiredFields.filter((f) => !f.v || f.v.toString().trim() === "");
    if (missing.length) {
      alert(`Please fill the required field: ${missing[0].name}`);
      return;
    }
// ✅ Email validation
    if (!isValidEmail(formData.trainerEmail)) {
      alert("⚠️ Please enter a valid trainer email address.");
      return;
    }

       // ✅ Employee selection validation
    if (formData.assignedEmployees.length === 0) {
      alert("⚠️ Please select at least one employee for this training.");
      return;
    }

    

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert("End Date cannot be before Start Date.");
      return;
    }

    // 🧾 Build FormData for backend
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("duration", formData.duration);
    data.append("trainerName", formData.trainerName);
    data.append("trainerEmail", formData.trainerEmail);
    data.append("assignedEmployees", JSON.stringify(formData.assignedEmployees)); // 👈 JSON array
    data.append("links", JSON.stringify(formData.links.filter((l) => l && l.trim() !== "")));

    // 🗂️ Add resources (files)
    if (formData.resources && formData.resources.length > 0) {
      for (let i = 0; i < formData.resources.length; i++) {
        data.append("resources", formData.resources[i]);
      }
    }

    // 🔐 Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authorized. Please login again.");
      return;
    }

    // 🚀 Send to backend
    const res = await axios.post("http://localhost:5000/api/trainings/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.success) {
      alert("✅ Training created successfully!");

  setTrainings(prev => [res.data.data, ...prev]);



      // Reset form & close modal
      setFormData({
        title: "",
        description: "",
        type: "Online",
        trainerName: "",
        trainerEmail: "",
        startDate: "",
        endDate: "",
        duration: "",
        assignedEmployees: [],
        resources: [],
        links: [""],
      });
      setShowModal(false);
    } else {
      alert("Error: " + (res.data.message || "Unable to create training"));
    }
  } catch (err) {
    console.error("Error saving training:", err);
    alert("❌ Failed to save training: " + err.message);
  }
};

const handleUpdateTraining = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please login again.");
      return;
    }
// ✅ Email validation
    if (!isValidEmail(formData.trainerEmail)) {
      alert("⚠️ Please enter a valid trainer email address.");
      return;
    }

    // ✅ Employee selection validation
    if (formData.assignedEmployees.length === 0) {
      alert("⚠️ Please select at least one employee for this training.");
      return;
    }
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("trainerName", formData.trainerName);
    data.append("trainerEmail", formData.trainerEmail);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("duration", formData.duration);
    data.append("assignedEmployees", JSON.stringify(
  formData.assignedEmployees.filter(empId => empId) // remove any null/undefined
));

    data.append("links", JSON.stringify(formData.links.filter(l => l && l.trim() !== "")));

    
    data.append("existingResources", JSON.stringify(formData.existingResources || []));

    // New files (to upload)
    if (formData.resources && formData.resources.length > 0) {
      for (let i = 0; i < formData.resources.length; i++) {
        data.append("resources", formData.resources[i]);
      }
    }

    const res = await axios.put(
      `http://localhost:5000/api/trainings/update/${trainingToEdit._id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.success) {
      alert("✅ Training updated successfully!");
       window.location.reload();
      // update local state
      setTrainings(prev =>
        prev.map(t => (t._id === trainingToEdit._id ? res.data.data : t))
      );
      setShowModal(false);
      setIsEditMode(false);
      setTrainingToEdit(null);
    } else {
      alert("❌ Update failed: " + res.data.message);
    }
  } catch (err) {
    console.error("Error updating training:", err);
    alert("❌ Failed to update training: " + err.message);
  }
};



// ✅ Reusable StatCard Component (Professional Design)
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div
    className={`flex items-center justify-between p-5 rounded-2xl shadow-md bg-gradient-to-br ${color} text-white transition transform hover:scale-[1.02]`}
  >
    <div>
      <p className="text-sm font-medium opacity-90">{label}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
    <div className="p-3 bg-white/20 rounded-xl">
      <Icon size={26} />
    </div>
  </div>
);

// ✅ KPI values derived from trainings
const total = trainings.length;
const active = trainings.filter((t) => t.status === "Active").length;
const completed = trainings.filter((t) => t.status === "Completed").length;
const enrolled = trainings.reduce((sum, t) => sum + (t.enrolled || 0), 0);



// ✅ Define the KPIs with icons and colors
const kpis = [
  {
    label: "Total Trainings",
    value: total,
    icon: BookOpen,
    color: "from-blue-500 to-blue-700",
  },
  {
    label: "Active Trainings",
    value: active,
    icon: Activity,
    color: "from-green-500 to-emerald-700",
  },
  {
    label: "Completed Trainings",
    value: completed,
    icon: CheckCircle,
    color: "from-purple-500 to-indigo-700",
  },
  {
    label: "Employees Enrolled",
    value: enrolled,
    icon: Users,
    color: "from-orange-500 to-yellow-600",
  },
];


  return (
    <div className="flex min-h-screen bg-gray-50">
    {/* ✅ HR Sidebar */}
    <HRLeftSideBar />

    {/* ✅ Main Page Content */}
    <div className="flex-1  overflow-y-auto  ml-64 p-6">
      {/* Header */}
     {/* Header Section */}
{/* Header Section */}
<div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
    Training Management
  </h1>
  <button
  onClick={() => {
    // 🧹 Reset form completely
    setFormData({
      title: "",
      description: "",
      type: "Online",
      trainerName: "",
      trainerEmail: "",
      startDate: "",
      endDate: "",
      duration: "",
      assignedEmployees: [],
      resources: [],
      links: [""],
    });

    // 🧭 Reset edit states
    setIsEditMode(false);
    setTrainingToEdit(null);

    // 🪟 Finally open modal
    setShowModal(true);
  }}
  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-all"
>
  <Plus size={18} /> Create New Training
</button>

</div>

{/* KPI Cards Section */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
  {kpis.map((kpi, i) => (
    <StatCard
      key={i}
      label={kpi.label}
      value={kpi.value}
      icon={kpi.icon}
      color={kpi.color}
    />
  ))}
</div>




      {/* Training Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-2">Training Name</th>
              <th className="py-3 px-2">Type</th>
              <th className="py-3 px-2">Duration</th>
              <th className="py-3 px-2">Start Date</th>
              <th className="py-3 px-2">End Date</th>
              <th className="py-3 px-2">Enrolled</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2 font-medium">{t.title}</td>
                <td className="py-2 px-2">{t.type}</td>
                <td className="py-2 px-2">{t.duration}</td>
                <td className="py-2 px-2">
  {new Date(t.startDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</td>
<td className="py-2 px-2">
  {new Date(t.endDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</td>

                <td className="py-2 px-2">{t.enrolled}</td>
                <td className="py-2 px-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    t.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-2 px-2 flex gap-3">
                 <button
  className="text-blue-600 hover:text-blue-800"
onClick={() => {
    setIsEditMode(true);
    setTrainingToEdit(t);

    // ✅ Reset everything fresh to prevent old values staying
    setFormData({
      title: t.title || "",
      description: t.description || "",
      type: t.type || "Online",
      trainerName: t.trainerName || "",
      trainerEmail: t.trainerEmail || "",
      startDate: t.startDate ? t.startDate.split("T")[0] : "",
      endDate: t.endDate ? t.endDate.split("T")[0] : "",
      duration: t.duration || "",
assignedEmployees: t.assignedEmployees?.map(emp => emp._id.toString()) || [],
      links: Array.isArray(t.links) && t.links.length > 0 ? [...t.links] : [""],
      existingResources: Array.isArray(t.resources) ? [...t.resources] : [],
      resources: [], // reset new uploads
    });
  // ✅ open modal fresh
  setShowModal(true);
}}


>
  <Pencil size={18} />
</button>

                  <button
  className="text-red-600 hover:text-red-800"
  onClick={() => {
    setTrainingToDelete(t);
    setShowDeleteModal(true);
  }}
>
  <Trash2 size={18} />
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

 {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] border border-gray-200">
      {/* Modal Header */}
      <div className="flex items-start justify-between gap-4 mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "✏️ Edit Training" : "✨ Create New Training"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in training details, schedule and assign employees.
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(false);
            setIsEditMode(false);
            setTrainingToEdit(null);
          }}
          className="text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full p-2 transition"
        >
          <X size={22} />
        </button>
      </div>

      {/* ✅ Wrap all fields inside form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isEditMode) {
            handleUpdateTraining();
          } else {
            handleSaveTraining();
          }
        }}
        className="space-y-6"
      >
        {/* Basic Info */}
        <div className="border rounded-xl p-5 bg-gray-50 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            📝 Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Training Title"
              required
              className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <select
              required
              className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option>Online</option>
              <option>Onsite</option>
              <option>Hybrid</option>
            </select>

            <textarea
              placeholder="Description"
              rows={4}
              required
              className="border rounded-lg p-3 col-span-1 md:col-span-2 min-h-[100px] resize-none w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="border rounded-xl p-5 bg-gray-50 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📅 Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <input
              type="date"
              required
              className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={new Date().toISOString().split("T")[0]}
              value={formData.startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
            />
            <input
              type="date"
              required
              className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={formData.startDate || new Date().toISOString().split("T")[0]}
              value={formData.endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
            />
            <input
              type="text"
              placeholder="Duration (auto)"
              readOnly
              className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-100"
              value={formData.duration}
            />
          </div>
        </div>

        {/* Trainer Info */}
        <div className="border rounded-xl p-5 bg-gray-50 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            👨‍🏫 Trainer / Responsible Person
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Trainer Name"
              required
              className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.trainerName}
              onChange={(e) =>
                setFormData({ ...formData, trainerName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Trainer Email"
              required
              className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.trainerEmail}
              onChange={(e) =>
                setFormData({ ...formData, trainerEmail: e.target.value })
              }
            />
          </div>
        </div>

        {/* Assign Employees */}
        <div className="border rounded-xl p-5 bg-gray-50 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              👥 Assign Employees
            </h3>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:underline"
            >
              {formData.assignedEmployees.length === employees.length
                ? "Unselect All"
                : "Select All"}
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto border rounded-lg p-2 bg-white">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <label
                  key={emp._id}
                  className="flex items-center gap-2 py-1 text-gray-700"
                >
                  <input
  type="checkbox"
  checked={formData.assignedEmployees.includes(emp._id.toString())}
  onChange={() => handleEmployeeToggle(emp._id.toString())}
/>

                  {emp.name}{" "}
                  <span className="text-sm text-gray-500">
                    ({emp.designation})
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No employees found.</p>
            )}
          </div>
        </div>

        {/* Resources */}
        <div className="border rounded-xl p-5 bg-gray-50 shadow-sm">
     <h3 className="text-lg font-semibold text-gray-700 mb-3">📂 Resources</h3>

  {/* Existing Resources */}
  {formData.existingResources && formData.existingResources.length > 0 && (
    <div className="mb-3">
      <p className="text-sm font-medium mb-1">Existing Resources:</p>
      <ul className="list-disc pl-5 space-y-1">
        {formData.existingResources.map((res, index) => (
          <li key={index} className="flex justify-between items-center">
            <a
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {res.name}
            </a>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  existingResources: prev.existingResources.filter(
                    (_, i) => i !== index
                  ),
                }))
              }
              className="text-red-600 hover:text-red-800 ml-2"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* Upload new files */}
  <input
    type="file"
    multiple
    className="border rounded-lg p-2.5 w-full mb-3 cursor-pointer"
    onChange={(e) =>
      setFormData({ ...formData, resources: Array.from(e.target.files) })
    }
  />

          {/* Links */}
          <div className="max-h-36 overflow-y-auto border rounded-lg p-3 space-y-2 bg-white">
            {formData.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder="Enter Resource Link (optional)"
                  className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {formData.links.length > 1 && (
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800 transition"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        links: prev.links.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={addLinkField}
              className="text-sm text-blue-600 hover:underline hover:text-blue-800"
            >
              + Add another link
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:opacity-95 shadow-lg transition"
          >
            {isEditMode ? "🔄 Update Training" : "💾 Save Training"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}




      </div>
    
   {/* ✅ Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-red-100 rounded-full">
          <Trash2 className="text-red-600" size={22} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Confirm Deletion
        </h2>
      </div>

      {/* Body */}
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete{" "}
        <span className="font-medium text-gray-800">
          "{trainingToDelete?.title}"
        </span>
        ? This action cannot be undone.
      </p>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");
              if (!token) {
                alert("Please login again.");
                return;
              }

              const res = await axios.delete(
                `http://localhost:5000/api/trainings/delete/${trainingToDelete._id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (res.data.success) {
                alert("✅ Training deleted successfully!");
                setTrainings((prev) =>
                  prev.filter((t) => t._id !== trainingToDelete._id)
                );
              } else {
                alert("❌ Error deleting training: " + res.data.message);
              }
            } catch (err) {
              console.error("Error deleting training:", err);
              alert("❌ Failed to delete training: " + err.message);
            } finally {
              setShowDeleteModal(false);
              setTrainingToDelete(null);
            }
          }}
          className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
 
    
    
    </div>
  );
};

export default HRTrainingPage;