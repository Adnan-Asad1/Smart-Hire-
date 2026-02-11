import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    designation: { type: String, required: true, trim: true },
      experience: { type: String, required: true, trim: true }, 
   
    skills: { type: [String], required: true, default: [] },
    password: { type: String, required: true } // will store HASH only
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);
