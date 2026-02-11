import mongoose from "mongoose";

const trainingSchema = new mongoose.Schema(
  {
    // 📘 Basic Information
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // 📍 Type of training: Online / Onsite / Hybrid
    type: {
      type: String,
      enum: ["Online", "Onsite", "Hybrid"],
      default: "Online",
    },

    // 📅 Schedule
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String, // e.g., "2 Days"
      default: "",
    },

    // 👨‍🏫 Trainer / Responsible Person
    trainerName: {
      type: String,
      required: true,
      trim: true,
    },
    trainerEmail: {
      type: String,
      required: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },


    // 👥 Employees assigned to this training
    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // 🔗 Reference to Employee collection
      },
    ],

    // 📂 Resources (files, PDFs, etc.)
    resources: [
      {
        name: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],

    // 🔗 Useful external links
    links: [
      {
        type: String,
        trim: true,
      },
    ],

    // 📊 Enrollment Count (auto-calculated or manual)
    enrolled: {
      type: Number,
      default: 0,
    },

    // 🏁 Training Status
    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },

    // 📈 Progress tracking (optional future feature)
    progress: {
      type: Number, // percent 0–100
      default: 0,
    },

    // 🕒 Created by which HR
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // HR user reference
    },
  },
  { timestamps: true }
);



export const Training = mongoose.model("Training", trainingSchema);
