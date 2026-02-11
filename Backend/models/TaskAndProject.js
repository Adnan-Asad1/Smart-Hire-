import mongoose from "mongoose";

// ----- Task Sub-Schema -----
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Assigned Employee (reference by ID)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    dueDate: { type: Date },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

  },
  { timestamps: true }
);

// ----- Project Schema -----
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["Active", "Completed", "On Hold"],
      default: "Active",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // Multiple employees assigned
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],

    // HR who created this project
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // HR Schema
      required: true,
    },

    // Nested Tasks
    tasks: [taskSchema],
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
