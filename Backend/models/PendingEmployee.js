import mongoose from "mongoose";

const pendingEmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  designation: { type: String, required: true },
experience: { type: String, required: true, trim: true },   skills: [String],
  password: { type: String, required: true }, // hashed
  createdAt: { type: Date, default: Date.now }
});

export const PendingEmployee = mongoose.model("PendingEmployee", pendingEmployeeSchema);
