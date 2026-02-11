// models/Invite.js
import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema({
  company: { type: String, required: true },
  companyCode: { type: String, required: true }, // e.g. SOFTWARE (generated from company)
  role: { type: String, enum: ["HR", "Employee"], required: true },
  email: { type: String, required: true, lowercase: true }, // recipient personal address
  token: { type: String, required: true, unique: true },
  // These are created at invite-creation in this reservation-on-create flow:
  assignedEmail: { type: String, default: null }, // e.g. SOFTWARE-2025-001@gmail.com
  sequenceNumber: { type: Number, default: null }, // numeric seq (1,2,3...)
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  consumedAt: { type: Date, default: null },
  consumedBy: { type: String, default: null }, // optional user id/email
});

export default mongoose.model("Invite", InviteSchema);
