import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiUpload,
  FiEye,
  FiDownload,
  FiTrash2,
  FiBell,
  FiFileText,
} from "react-icons/fi";
import axios from "axios";
import EmployeeLeftSideBar from "./EmployeeLeftSideBar"; // ✅ Predefined Sidebar

const EmployeeDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
const [filter, setFilter] = useState("Pending");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreview, setShowPreview] = useState(null);

  // ✅ Upload form states
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [deleteDocId, setDeleteDocId] = useState(null); // ✅ store which doc to delete
const token = localStorage.getItem("employeeToken");
const [companyDocs, setCompanyDocs] = useState([]); // ✅ Company docs ke liye
const [selectedDescription, setSelectedDescription] = useState(null);

 // 🔹 Fetch documents from backend
const fetchDocuments = async () => {
  try {
    const token = localStorage.getItem("employeeToken"); // 👈 token nikaal liya

    const res = await axios.get("http://localhost:5000/api/documents/getDocuments", {
      headers: {
        Authorization: `Bearer ${token}`, // 👈 Token bhej diya
      },
    });

    if (res.data.success) {
  setDocuments(res.data.documents || []); // ✅ fallback array
    }
  } catch (err) {
    console.error("Error fetching documents:", err);
  }
};



const fetchAssignedHRDocs = async () => {
  try {
    const token = localStorage.getItem("employeeToken");

    const res = await axios.get(
      "http://localhost:5000/api/documents/HRDocuments/assigned",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setCompanyDocs(res.data.documents || []);
    }
  } catch (err) {
    console.error("Error fetching assigned HR documents:", err);
  }
};


  useEffect(() => {
    fetchDocuments();
    fetchAssignedHRDocs();
  }, []);

const filteredDocs = (documents || []).filter((doc) => {
  if (filter === "Pending") return doc.status === "Pending";
  if (filter === "Approved") return ["Approved", "Rejected"].includes(doc.status);
  if (filter === "Company Documents") return doc.category === "Company";
  return true; // default
});



  // ✅ Handle File Upload Form
  const handleUpload = async (e) => {
  e.preventDefault();

  if (!docTitle || !docCategory || !docFile) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const token = localStorage.getItem("employeeToken");

    const formData = new FormData();
    formData.append("title", docTitle);
    formData.append("category", docCategory);
    formData.append("file", docFile);

    const res = await axios.post(
      "http://localhost:5000/api/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // 👈 yahan bheja
        },
      }
    );

    if (res.data.success) {
setDocuments([...(documents || []), res.data.document]); 
      setShowUploadModal(false);

      // Reset form
      setDocTitle("");
      setDocCategory("");
      setDocFile(null);
    }
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Error uploading document");
  }
};



const handleConfirmDelete = async () => {
  if (!deleteDocId) return;

  try {
    const token = localStorage.getItem("employeeToken");

    const res = await axios.delete(
      `http://localhost:5000/api/documents/delete/${deleteDocId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setDocuments(documents.filter((doc) => doc._id !== deleteDocId));
      setDeleteDocId(null); // ✅ close modal
    } else {
      alert(res.data.message || "Failed to delete document");
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("Error deleting document");
  }
};

// 🔹 Download Document Function
const handleDownload = async (doc) => {
  try {
    const res = await axios.get(`http://localhost:5000${doc.fileUrl}`, {
      responseType: "blob", // 👈 blob data lena zaroori hai
    });

    // 🔹 Blob se URL create karo
    const fileURL = window.URL.createObjectURL(new Blob([res.data]));

    // 🔹 Hidden link banake click karo
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", doc.title + getFileExtension(doc.fileUrl)); // 👈 proper filename
    document.body.appendChild(link);
    link.click();

    // 🔹 Cleanup
    link.remove();
    window.URL.revokeObjectURL(fileURL);
  } catch (err) {
    console.error("Download error:", err);
    alert("Failed to download document");
  }
};

// 🔹 Helper: extract extension
const getFileExtension = (url) => {
  return url.substring(url.lastIndexOf(".")) || ".pdf";
};













  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ Left Sidebar */}
      <EmployeeLeftSideBar />

      {/* ✅ Main Section */}
      <div className="flex-1 flex flex-col">
        {/* ✅ Topbar */}
        <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 sticky top-0 z-20">
          <h2 className="text-2xl font-bold text-gray-700">📂 My Documents</h2>
          <div className="flex items-center gap-5">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 bg-gray-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Notifications */}
            <button className="relative hover:scale-105 transition">
              <FiBell className="text-gray-600 text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </button>
            {/* Avatar */}
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-gray-300"
            />
          </div>
        </div>

        {/* ✅ Filters + Upload */}
        <div className="flex justify-between items-center p-6">
          <div className="flex space-x-2 p-6">
  {["Pending", "Approved", "Company Documents"].map((cat) => (
    <button
      key={cat}
      className={`px-5 py-2 rounded-full text-sm font-medium shadow-sm transition ${
        filter === cat
          ? "bg-blue-600 text-white shadow-md"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      onClick={() => setFilter(cat)}
    >
      {cat}
    </button>
  ))}
</div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md transition"
          >
            <FiUpload /> Upload Document
          </button>
        </div>

        {/* ✅ Documents Table */}
      <div className="p-6 overflow-x-auto">
  {filter === "Company Documents" ? (
    // ✅ Company Documents Table
    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-blue-50 text-blue-900">
        <tr>
          <th className="py-3 px-4 text-left">Document</th>
          <th className="py-3 px-4 text-left">Category</th>
          <th className="py-3 px-4 text-left">Uploaded Date</th>
          <th className="py-3 px-4 text-left">Description</th>
          <th className="py-3 px-4 text-left">Approved By</th>
          <th className="py-3 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
       {companyDocs.map((doc) => (
        <tr key={doc._id} className="border-t hover:bg-gray-50 transition">
          <td className="py-3 px-4 flex items-center gap-2 font-medium">
            <FiFileText className="text-blue-500" />
            {doc.title}
          </td>
          <td className="py-3 px-4">{doc.category}</td>
          <td className="py-3 px-4">
            {new Date(doc.createdAt).toISOString().split("T")[0]}
          </td>
<td className="py-3 px-4">
  <button
    onClick={() => setSelectedDescription(doc.description || "No description provided.")}
    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
  >
    View
  </button>
</td>
          <td className="py-3 px-4">
            {doc.uploadedBy?.fullName || "N/A"}
          </td>
          <td className="py-3 px-4 flex gap-4">
            <button
              onClick={() => setShowPreview(doc)}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <FiEye />
            </button>
            <button
              className="text-green-600 hover:text-green-800 transition"
              onClick={() => handleDownload(doc)}
            >
              <FiDownload />
            </button>
          </td>
        </tr>
      ))}
         {companyDocs.length === 0 && (
        <tr>
          <td colSpan="6" className="py-10 text-center text-gray-500">
            <div className="flex flex-col items-center">
              <FiFileText className="text-4xl text-gray-400 mb-2" />
              <p>No HR documents assigned to you.</p>
            </div>
          </td>
        </tr>
      )}
      </tbody>
    </table>
  ) : (
    // ✅ Existing Table (Pending / Approved)
    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-blue-50 text-blue-900">
        <tr>
          <th className="py-3 px-4 text-left">File</th>
          <th className="py-3 px-4 text-left">Category</th>
          <th className="py-3 px-4 text-left">Uploaded On</th>
          <th className="py-3 px-4 text-left">Status</th>
          {filter === "Approved" && (
            <th className="py-3 px-4 text-left">Approved By</th>
          )}
          <th className="py-3 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredDocs.map((doc) => (
          <tr
            key={doc._id}
            className="border-t hover:bg-gray-50 transition"
          >
            <td className="py-3 px-4 flex items-center gap-2 font-medium">
              <FiFileText className="text-blue-500" />
              {doc.title}
            </td>
            <td className="py-3 px-4">{doc.category}</td>
            <td className="py-3 px-4">
              {new Date(doc.createdAt).toISOString().split("T")[0]}
            </td>
            <td className="py-3 px-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  doc.status === "Approved"
                    ? "bg-green-100 text-green-600"
                    : doc.status === "Pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {doc.status}
              </span>
            </td>
            {filter === "Approved" && (
              <td className="py-3 px-4">
                {doc.approvedBy?.id?.fullName || "N/A"}
              </td>
            )}
            <td className="py-3 px-4 flex gap-4">
              <button
                onClick={() => setShowPreview(doc)}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <FiEye />
              </button>
              <button
                className="text-green-600 hover:text-green-800 transition"
                onClick={() => handleDownload(doc)}
              >
                <FiDownload />
              </button>
              {(doc.category === "Personal" || doc.category === "Other") && (
                <button
                  onClick={() => setDeleteDocId(doc._id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <FiTrash2 />
                </button>
              )}
            </td>
          </tr>
        ))}
        {filteredDocs.length === 0 && (
          <tr>
            <td colSpan="5" className="py-10 text-center text-gray-500">
              <div className="flex flex-col items-center">
                <FiFileText className="text-4xl text-gray-400 mb-2" />
                <p>No documents found. Try uploading one!</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )}
</div>

      </div>

      {/* ✅ Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* Title */}
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FiUpload className="text-blue-600" /> Upload New Document
            </h3>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleUpload}>
              {/* Document Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Enter document title..."
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>

              {/* Select Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                >
                  <option value="">-- Select --</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File <span className="text-red-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <p className="text-gray-500">
                    Drag & drop file here or{" "}
                    <span className="text-blue-600">browse</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Supported: PDF, JPG, PNG, DOCX
                  </p>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={(e) => setDocFile(e.target.files[0])}
                  />
                  {docFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {docFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-3xl relative">
            <h3 className="text-lg font-bold mb-4 text-gray-700">
              Preview: {showPreview.title}
            </h3>

            <div className="border h-[500px] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
              {/* 🔹 Render based on file type */}
              {showPreview.fileUrl ? (
                showPreview.fileUrl.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={`http://localhost:5000${showPreview.fileUrl}`}
                    title="PDF Preview"
                    className="w-full h-full"
                  />
                ) : showPreview.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img
                    src={`http://localhost:5000${showPreview.fileUrl}`}
                    alt="Document Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">
                      Preview not available for this file type.
                    </p>
                    <a
                      href={`http://localhost:5000${showPreview.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Open File
                    </a>
                  </div>
                )
              ) : (
                <p className="text-gray-500">No preview available</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPreview(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
   
   
   



   {/* ✅ Delete Confirmation Modal */}
{deleteDocId && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm text-center">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Are you sure you want to delete this document?
      </h3>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setDeleteDocId(null)} // ❌ cancel
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmDelete} // ✅ confirm delete
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Yes, Delete
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

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        📄 Document Description
      </h3>

      {/* Description Content */}
      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
        {selectedDescription}
      </p>

      {/* Footer */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setSelectedDescription(null)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
 
   
   
   
    </div>
  );
};

export default EmployeeDocumentsPage;
