import { Document } from "../models/Document.js";
import { HRDocument } from "../models/HRDocument.js";
import fs from "fs";
import path from "path";
// Upload New Document
export const uploadDocument = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const newDoc = new Document({
      title,
      category,
      fileUrl: `/uploads/documents/${req.file.filename}`, // save relative path
      uploadedBy: {
        id: req.user.id,
        role: req.user.role, // 👈 token se milega (HR / Employee)
      },
    });

    await newDoc.save();

    res.status(201).json({ success: true, document: newDoc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Get Documents (Employee / HR specific)
export const getDocuments = async (req, res) => {
  try {
    let docs;

    if (req.user.role === "employee") {
      // ✅ Employee apne hi docs dekh sakta hai
      docs = await Document.find({ "uploadedBy.id": req.user.id })
        .populate("approvedBy.id", "fullName email") // HR details
        .populate("uploadedBy.id", "name email designation");
    } else if (req.user.role === "hr") {
      // ✅ HR sab docs dekh sakta hai
      docs = await Document.find()
        .populate("approvedBy.id", "fullName email") // HR details
        .populate("uploadedBy.id", "name email designation");
    }

    res.json({ success: true, documents: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// ✅ Update Document Status (Approve / Reject by HR)
export const updateDocumentStatus = async (req, res) => {
  try {
    if (req.user.role !== "hr") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { status } = req.body; // frontend se "Approved" / "Rejected" aayega
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      {
        status,
        approvedBy: {
          id: req.user.id,        // HR ka ObjectId
          role: req.user.role,
          date: new Date(),
        },
      },
      { new: true }
    ).populate("uploadedBy.id", "name email designation");

    if (!updatedDoc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.json({
      success: true,
      message: `Document ${status.toLowerCase()} successfully`,
      document: updatedDoc,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};





// Delete Document (Employee apna / HR sabka delete kar sakta hai)
export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // 🔹 Access control check
    if (req.user.role === "employee" && doc.uploadedBy.id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // 🔹 File path banani hai (absolute path)
    const filePath = path.join(process.cwd(), doc.fileUrl);

    // 🔹 Pehle DB se document delete karte hain
    await Document.findByIdAndDelete(req.params.id);

    // 🔹 File delete from filesystem
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("File deletion error:", err);
      }
    });

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




// ✅ Get All Pending Documents (for HRs)
export const getPendingDocuments = async (req, res) => {
  try {
    if (req.user.role !== "hr") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Sare pending docs le aao aur Employee ka name populate karo
    const pendingDocs = await Document.find({ status: "Pending" })
      .populate("uploadedBy.id", "name email designation");

    res.json({ success: true, documents: pendingDocs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};







// ✅ Get Approved Documents of Authenticated HR
export const getApprovedDocsByHR = async (req, res) => {
  try {
    if (req.user.role !== "hr") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const approvedDocs = await Document.find({
      status: "Approved",
      "approvedBy.id": req.user.id, // 👈 sirf us HR ka data
    })
      .populate("uploadedBy.id", "name email designation")
      .sort({ createdAt: -1 });

    res.json({ success: true, documents: approvedDocs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Rejected Documents of Authenticated HR
export const getRejectedDocsByHR = async (req, res) => {
  try {
    if (req.user.role !== "hr") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const rejectedDocs = await Document.find({
      status: "Rejected",
      "approvedBy.id": req.user.id, // 👈 sirf us HR ka data
    })
      .populate("uploadedBy.id", "name email designation")
      .sort({ createdAt: -1 });

    res.json({ success: true, documents: rejectedDocs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};







// ✅ HR Document Upload Controller
export const uploadHRDocument = async (req, res) => {
  try {
    const { title, category, description, assignedEmployees } = req.body;

    // Agar file nahi mila
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Naya Document banao
    const newDoc = new HRDocument({
      title,
      category,
      description,
      fileUrl: `/uploads/documents/${req.file.filename}`, // File ka path
      uploadedBy: req.user.id, // AuthMiddleware se aaya user (HR ka ID)
      assignedEmployees: assignedEmployees ? JSON.parse(assignedEmployees) : [], // frontend se array bhejo
    });

    await newDoc.save();

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: newDoc,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};




// ✅ Get HR Documents uploaded by the logged-in HR only
export const getMyHRDocuments = async (req, res) => {
  try {
    if (req.user.role !== "hr") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const myDocs = await HRDocument.find({ uploadedBy: req.user.id })
      .populate("assignedEmployees", "name email designation") // Employee details show karne ke liye
      .sort({ createdAt: -1 }); // latest first

    res.json({ success: true, documents: myDocs });
  } catch (err) {
    console.error("Error fetching HR Documents:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};




// ✅ Delete HR Document (only uploaded HR can delete)
export const deleteHRDocument = async (req, res) => {
  try {
    const hrDoc = await HRDocument.findById(req.params.id);

    if (!hrDoc) {
      return res.status(404).json({ success: false, message: "HR Document not found" });
    }

    // 🔹 Only the HR who uploaded this doc can delete
    if (req.user.role !== "hr" || hrDoc.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // 🔹 File absolute path
    const filePath = path.join(process.cwd(), hrDoc.fileUrl);

    // 🔹 Delete document from DB
    await HRDocument.findByIdAndDelete(req.params.id);

    // 🔹 Delete file from filesystem
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("File deletion error:", err);
      }
    });

    res.json({ success: true, message: "HR Document deleted successfully" });
  } catch (err) {
    console.error("Delete HR Document Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};




// ✅ Get HR Documents assigned to the logged-in Employee
export const getAssignedHRDocuments = async (req, res) => {
  try {
    if (req.user.role !== "employee") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const employeeId = req.user.id; // 👈 Employee ID from authMiddleware

    // Find HR Documents where this employee is assigned
    const assignedDocs = await HRDocument.find({
      assignedEmployees: employeeId,
      status: "Active", // optional: only active docs
    })
      .populate("uploadedBy", "fullName email") // HR details
      .populate("assignedEmployees", "name email designation") // Employee details
      .sort({ createdAt: -1 });

    if (!assignedDocs || assignedDocs.length === 0) {
      return res.json({
        success: true,
        documents: [],
        message: "No documents assigned to you",
      });
    }

    res.json({ success: true, documents: assignedDocs });
  } catch (err) {
    console.error("Error fetching assigned HR Documents:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
