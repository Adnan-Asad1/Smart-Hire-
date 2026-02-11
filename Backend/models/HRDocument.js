import mongoose from "mongoose";

const hrDocumentSchema = new mongoose.Schema(
  {
    // 🔹 Title of the Document
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔹 File path / URL (where the file is stored, e.g. uploads/documents/file.pdf)
    fileUrl: {
      type: String,
      required: true,
    },

    // 🔹 HR who uploaded this document
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to HR User
      required: true,
    },

    // 🔹 Employees to whom the document is assigned
    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // Reference to Employee model
      },
    ],

    // 🔹 Category (Policy, Notice, General, etc.)
    category: {
      type: String,
      enum: ["Policy", "Notice", "General", "Other"],
      default: "General",
    },

    // 🔹 Description (optional field for HR to explain the document purpose)
    description: {
      type: String,
      trim: true,
    },

    // 🔹 Status (by default Active)
    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active",
    },

    // 🔹 Date of upload (auto from timestamps)
  },
  { timestamps: true }
);

export const HRDocument = mongoose.model("HRDocument", hrDocumentSchema);
