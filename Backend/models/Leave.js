import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // 🔗 Employee se link
    required: true,
  },
  leaveType: {
    type: String,
    enum: ["Casual", "Sick", "Annual", "Maternity/Paternity"],
    required: true,
  },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 🔗 HR/User se link
  },
  createdAt: { type: Date, default: Date.now },
});

export const Leave = mongoose.model("Leave", LeaveSchema);
