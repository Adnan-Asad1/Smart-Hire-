import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";
import HRLeftSideBar from "./HRLeftSideBar"; // ✅ Predefined Sidebar

const HRDocumentsPage = () => {
  const [activeTab, setActiveTab] = useState("Pending"); // ✅ Tabs: Pending | Approved | Rejected | HR Documents
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedHRDoc, setSelectedHRDoc] = useState(null);
const [confirmAction, setConfirmAction] = useState(null); // { type: "Approve" | "Reject", docId: "..." }
const [employees, setEmployees] = useState([]);
const [selectedEmployees, setSelectedEmployees] = useState([]);
// 🔹 State for description modal
const [selectedDescription, setSelectedDescription] = useState(null);
 const [companyDocs, setCompanyDocs] = useState([]);


 const [deleteDoc, setDeleteDoc] = useState(null); // { _id, title }
  // 🔹 Backend se documents fetch honge
const [documents, setDocuments] = useState([]);
  // 🔹 Fetch Pending Documents (only when HR is viewing Pending tab)

  // 🔹 States
const [pendingDocs, setPendingDocs] = useState([]);
const [approvedDocs, setApprovedDocs] = useState([]);
const [rejectedDocs, setRejectedDocs] = useState([]);




// 🔹 Fetch Pending Documents (backend se)
useEffect(() => {
  const fetchPendingDocs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/documents/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setPendingDocs(res.data.documents);
      }
    } catch (err) {
      console.error("Error fetching pending documents:", err);
    }
  };

  if (activeTab === "Pending") {
    fetchPendingDocs();
  }
}, [activeTab]);

// 🔹 Fetch Approved Documents (backend se)
useEffect(() => {
  const fetchApprovedDocs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/documents/approved/hr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setApprovedDocs(res.data.documents);
      }
    } catch (err) {
      console.error("Error fetching approved documents:", err);
    }
  };

  if (activeTab === "Approved") {
    fetchApprovedDocs();
  }
}, [activeTab]);

// 🔹 Fetch Rejected Documents (backend se)
useEffect(() => {
  const fetchRejectedDocs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/documents/rejected/hr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setRejectedDocs(res.data.documents);
      }
    } catch (err) {
      console.error("Error fetching rejected documents:", err);
    }
  };

  if (activeTab === "Rejected") {
    fetchRejectedDocs();
  }
}, [activeTab]);



useEffect(() => {
  if (uploadModal) {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/employees/getEmployees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.employees) {
          setEmployees(res.data.employees);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }
}, [uploadModal]);

const handleEmployeeSelect = (id) => {
  setSelectedEmployees((prev) =>
    prev.includes(id)
      ? prev.filter((empId) => empId !== id) // unselect
      : [...prev, id] // select
  );
};




useEffect(() => {
  const fetchCompanyDocs = async () => {
    try {
      const token = localStorage.getItem("token");
      // adapt this endpoint if your backend uses a different route
      const res = await axios.get("http://localhost:5000/api/documents/HRDocuments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setCompanyDocs(res.data.documents || []);
      }
    } catch (err) {
      console.error("Error fetching HR/company documents:", err);
      setCompanyDocs([]);
    }
  };

  if (activeTab === "HR Documents") {
    fetchCompanyDocs();
  }
}, [activeTab]);



const handleApproveReject = async () => {
  if (!confirmAction) return;
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `http://localhost:5000/api/documents/status/${confirmAction.docId}`,
      { status: confirmAction.type },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.success) {
      // ✅ Remove from pending
      const updatedDoc = pendingDocs.find((doc) => doc._id === confirmAction.docId);
      setPendingDocs((prev) =>
        prev.filter((doc) => doc._id !== confirmAction.docId)
      );

      // ✅ Add instantly to Approved/Rejected lists
      if (updatedDoc) {
        const newDoc = { ...updatedDoc, status: confirmAction.type };
        if (confirmAction.type === "Approved") {
          setApprovedDocs((prev) => [newDoc, ...prev]);
        } else {
          setRejectedDocs((prev) => [newDoc, ...prev]);
        }
      }

      setConfirmAction(null); // close modal
    }
  } catch (err) {
    console.error("Error updating document status:", err);
  }
};




  // 🔹 Filtered by Active Tab + Search
const filteredDocs =
  activeTab === "Pending"
    ? pendingDocs
    : activeTab === "Approved"
    ? approvedDocs
    : activeTab === "Rejected"
    ? rejectedDocs
    : [];

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* 🔹 Sidebar */}
      
      <HRLeftSideBar />

      {/* 🔹 Main Content */}
      <div className="flex-1  ml-64 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            📂 Employee Documents
          </h2>
          <button
            onClick={() => setUploadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:opacity-90 transition"
          >
            <FiUpload /> Upload Company Document
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {["Pending", "Approved", "Rejected", "HR Documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 font-semibold ${
                activeTab === tab
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>


        {/* Employee Documents Table */}
        {activeTab !== "HR Documents" && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border border-gray-200">
  <table className="w-full text-sm text-left">
    {/* Table Header */}
    <thead className="bg-gradient-to-r from-blue-50 to-indigo-100 text-indigo-800 text-sm uppercase tracking-wide">
      <tr>
        <th className="px-6 py-4 font-semibold">Employee</th>
        <th className="px-6 py-4 font-semibold">Document</th>
        <th className="px-6 py-4 font-semibold">Category</th>
        <th className="px-6 py-4 font-semibold">Uploaded Date</th>
        <th className="px-6 py-4 font-semibold">Status</th>
        <th className="px-6 py-4 font-semibold text-center">Actions</th>
      </tr>
    </thead>

    {/* Table Body */}
    <tbody className="divide-y divide-gray-100">
      {filteredDocs.map((doc) => (
        <tr
          key={doc.id}
          className="hover:bg-blue-50 transition-colors duration-200"
        >
          {/* Employee */}
        <td className="px-6 py-4 font-medium text-gray-900">
  {doc.uploadedBy?.id?.name || "Unknown Employee"}
</td>


          {/* Document */}
          <td className="px-6 py-4 text-gray-700">{doc.title}</td>

         {/* Category */}
          <td className="px-6 py-4">
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                doc.category === "Personal"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {doc.category}
            </span>
          </td>

          {/* Date */}
          <td className="px-6 py-4 text-gray-600">
            {new Date(doc.createdAt).toLocaleDateString()}
          </td>

          {/* Status */}
          <td className="px-6 py-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                doc.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : doc.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {doc.status}
            </span>
          </td>

          {/* Actions */}
          <td className="px-6 py-4 flex justify-center gap-2">
            {/* View */}
            <button
              onClick={() => setSelectedDoc(doc)}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              title="View Document"
            >
              <FiEye />
            </button>

            {activeTab === "Pending" && (
  <>
    {/* Approve */}
    <button
      onClick={() => setConfirmAction({ type: "Approved", docId: doc._id })}
      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
      title="Approve"
    >
      <FiCheckCircle />
    </button>

    {/* Reject */}
    <button
      onClick={() => setConfirmAction({ type: "Rejected", docId: doc._id })}
      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
      title="Reject"
    >
      <FiXCircle />
    </button>
  </>
)}

            {activeTab !== "Pending" && (
              <button
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                title="Download"
              >
                <FiDownload />
              </button>
            )}
          </td>
        </tr>
      ))}

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <tr>
          <td
            colSpan="6"
            className="text-center py-10 text-gray-500 italic"
          >
            No {activeTab.toLowerCase()} documents found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        )}

       {/* ✅ HR Uploaded Documents Table (only show when HR Documents tab is active) */}
{activeTab === "HR Documents" && (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <table className="w-full text-sm text-left">
      <thead className="bg-gradient-to-r from-blue-50 to-indigo-100 text-indigo-800 text-sm uppercase tracking-wide">
        <tr>
          <th className="px-5 py-3">Document</th>
          <th className="px-5 py-3">Category</th>
          <th className="px-5 py-3">Assigned Employees</th>
          <th className="px-5 py-3">Uploaded Date</th>
          <th className="px-5 py-3">Description</th>
          <th className="px-5 py-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {companyDocs.map((doc) => {
          const assigned = doc.assignedEmployees || [];
          const displayedEmployees = assigned.slice(0, 2);
          const empLabel = (emp) => (emp && emp.name ? emp.name : String(emp));

          return (
            <tr key={doc._id} className="border-t hover:bg-gray-50 transition">
              <td className="px-5 py-4 font-medium">{doc.title}</td>
              <td className="px-5 py-4">{doc.category}</td>

              <td className="px-5 py-4">
                {displayedEmployees.map((emp, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-1"
                  >
                    {empLabel(emp)}
                  </span>
                ))}

                {assigned.length > 2 && (
                  <span
                    className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-300"
                    title={assigned.map((e) => empLabel(e)).join(", ")}
                  >
                    +{assigned.length - 2} more
                  </span>
                )}
              </td>

              <td className="px-5 py-4">{new Date(doc.createdAt).toLocaleDateString()}</td>

              <td className="px-5 py-4">
                <button
                  onClick={() => setSelectedDescription(doc)}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition text-xs font-medium"
                >
                  View
                </button>
              </td>

              <td className="px-5 py-4 flex justify-center gap-2">
                <button
                  onClick={() => setSelectedHRDoc(doc)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                >
                  <FiEye />
                </button>

                <a
                  href={`http://localhost:5000${doc.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                >
                  <FiDownload />
                </a>

                <button
  onClick={() => setDeleteDoc(doc)}
  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
>
  <FiTrash2 />
</button>

              </td>
            </tr>
          );
        })}

        {companyDocs.length === 0 && (
          <tr>
            <td colSpan="6" className="text-center py-6 text-gray-500">
              No HR uploaded documents found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}


      </div>

      {/* ✅ Modals remain unchanged (Employee Docs, HR Docs, Reject, Upload) */}
      {/* View Modal (Employee Docs) */}
 {selectedDoc && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative border border-gray-200">
      {/* Close Button (Top Right) */}
      <button
        onClick={() => setSelectedDoc(null)}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
      >
        ✕
      </button>

      {/* Header */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        📄 Document Details
      </h3>

      {/* Details Section */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Employee:</span>{" "}
          {selectedDoc.uploadedBy?.id?.name || "Unknown"}
        </p>
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {selectedDoc.uploadedBy?.id?.email || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Document:</span>{" "}
          {selectedDoc.title}
        </p>
        <p>
          <span className="font-semibold">Category:</span>{" "}
          {selectedDoc.category}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${
              selectedDoc.status === "Approved"
                ? "bg-green-100 text-green-700"
                : selectedDoc.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {selectedDoc.status}
          </span>
        </p>
        <p>
          <span className="font-semibold">Date:</span>{" "}
          {new Date(selectedDoc.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Document Preview */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-800 mb-2">Preview:</h4>
        <div className="border rounded-xl overflow-hidden h-[350px]">
          <iframe
            src={`http://localhost:5000${selectedDoc.fileUrl}`}
            title={selectedDoc.title}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setSelectedDoc(null)}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition"
        >
          Close
        </button>
        <a
          href={`http://localhost:5000${selectedDoc.fileUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
        >
          Open Full View
        </a>
      </div>
    </div>
  </div>
)}


     
{/* ✅ HR Document Preview Modal - same design as selectedDoc preview */}
{selectedHRDoc && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative border border-gray-200">
      {/* Close Button (Top Right) */}
      <button
        onClick={() => setSelectedHRDoc(null)}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
      >
        ✕
      </button>

      {/* Header */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        📄 HR Document Details
      </h3>

      {/* Details Section */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Title:</span>{" "}
          {selectedHRDoc.title || selectedHRDoc.name || "Untitled"}
        </p>
        <p>
          <span className="font-semibold">Category:</span>{" "}
          {selectedHRDoc.category || "N/A"}
        </p>
        <p className="col-span-2">
          <span className="font-semibold">Description:</span>{" "}
          {selectedHRDoc.description || "No description provided"}
        </p>
        <p className="col-span-2">
          <span className="font-semibold">Assigned Employees:</span>{" "}
          {Array.isArray(selectedHRDoc.assignedEmployees) &&
          selectedHRDoc.assignedEmployees.length > 0
            ? selectedHRDoc.assignedEmployees
                .map((e) => (e && e.name ? e.name : String(e)))
                .join(", ")
            : "No employees assigned"}
        </p>
        <p>
          <span className="font-semibold">Uploaded On:</span>{" "}
          {selectedHRDoc.createdAt
            ? new Date(selectedHRDoc.createdAt).toLocaleDateString()
            : selectedHRDoc.date || "N/A"}
        </p>
      </div>

      {/* Document Preview */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-800 mb-2">Preview:</h4>
        <div className="border rounded-xl overflow-hidden h-[350px]">
          <iframe
            src={
              selectedHRDoc.fileUrl
                ? `http://localhost:5000${selectedHRDoc.fileUrl}`
                : "about:blank"
            }
            title={selectedHRDoc.title || "HR Document"}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setSelectedHRDoc(null)}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition"
        >
          Close
        </button>
        <a
          href={
            selectedHRDoc.fileUrl
              ? `http://localhost:5000${selectedHRDoc.fileUrl}`
              : "#"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
        >
          Open Full View
        </a>
      </div>
    </div>
  </div>
)}



      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h3 className="text-lg font-bold mb-4">Reject Document</h3>
            <textarea
              placeholder="Enter rejection reason..."
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-red-400"
              rows="3"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
    {uploadModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full relative">
      {/* Header */}
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
        📤 Upload Company Document
      </h3>

      {/* Upload Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData();
          formData.append("title", e.target.title.value);
          formData.append("category", e.target.category.value);
          formData.append("description", e.target.description.value);
          formData.append("file", e.target.file.files[0]);
          formData.append("assignedEmployees", JSON.stringify(selectedEmployees));

          try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
              "http://localhost:5000/api/documents/HRDocuments/upload",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (res.data.success) {
              alert("✅ Document uploaded successfully!");
              setUploadModal(false);
            }
          } catch (err) {
            console.error("Upload Error:", err);
            alert("❌ Failed to upload document");
          }
        }}
        className="space-y-5"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Title
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="Enter document title..."
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Policy">Policy</option>
            <option value="Notice">Notice</option>
            <option value="General">General</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter a short description..."
            rows="3"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Employees Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign to Employees
          </label>
          <div className="max-h-40 overflow-y-auto border rounded-lg p-3">
            {employees.map((emp) => (
              <label
                key={emp._id}
                className="flex items-center gap-2 mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={emp._id}
                  checked={selectedEmployees.includes(emp._id)}
                  onChange={() => handleEmployeeSelect(emp._id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  {emp.name} ({emp.designation})
                </span>
              </label>
            ))}
            {employees.length === 0 && (
              <p className="text-sm text-gray-500 italic">No employees found</p>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload File
          </label>
          <input
            type="file"
            name="file"
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => setUploadModal(false)}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:opacity-90 transition"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  </div>
)}

   
   
   {confirmAction && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
      <h3 className="text-lg font-bold mb-4">Confirm {confirmAction.type}</h3>
      <p className="text-gray-700 mb-6">
        Are you sure you want to{" "}
        <span
          className={
            confirmAction.type === "Approved"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {confirmAction.type}
        </span>{" "}
        this document?
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setConfirmAction(null)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleApproveReject}
          className={`px-4 py-2 rounded-lg text-white ${
            confirmAction.type === "Approved"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

   


   
{/* ✅ Description Modal */}
{selectedDescription && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
      {/* Close Button */}
      <button
        onClick={() => setSelectedDescription(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
      >
        ✕
      </button>

      {/* Header */}
      <h3 className="text-xl font-bold text-indigo-700 mb-4">
        📄 {selectedDescription.title || selectedDescription.name || "Untitled Document"}
      </h3>

      {/* Category */}
      <p className="text-sm text-gray-600 mb-2">
        <strong>Category:</strong> {selectedDescription.category || "N/A"}
      </p>

      {/* Description */}
      <div className="bg-gray-50 border rounded-lg p-4 text-gray-700 text-sm leading-relaxed">
        {selectedDescription.description || "No description provided."}
      </div>

      {/* Footer */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={() => setSelectedDescription(null)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


{deleteDoc && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
      <h3 className="text-lg font-bold mb-4 text-red-600">Delete Document</h3>
      <p className="text-gray-700 mb-6">
        Are you sure you want to permanently delete{" "}
        <span className="font-semibold">{deleteDoc.title}</span>?
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setDeleteDoc(null)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");
              const res = await axios.delete(
                `http://localhost:5000/api/documents/HRDocuments/delete/${deleteDoc._id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (res.data.success) {
                setCompanyDocs((prev) =>
                  prev.filter((doc) => doc._id !== deleteDoc._id)
                );
                setDeleteDoc(null);
              }
            } catch (err) {
              console.error("Delete Error:", err);
              alert("❌ Failed to delete document");
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

export default HRDocumentsPage;