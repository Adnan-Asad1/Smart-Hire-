import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Personal", "Company", "Other"],
      required: true,
    },
    fileUrl: { type: String, required: true }, // multer ke through store hone wala file ka path
    uploadedBy: {
  id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },   // 🟢 Employee se link
      role: { type: String, enum: ["hr", "employee"], required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    approvedBy: {
  id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // HR ka reference
  role: { type: String, enum: ["hr"] },
  date: { type: Date } // approve/reject ka time
},

  },
  { timestamps: true }
);

export const Document = mongoose.model("Document", documentSchema);
