import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  hrRole: {
    type: String,
    required: true,
  },
  experience: {
    type: String,   // 🔑 String instead of Number
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

export const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
