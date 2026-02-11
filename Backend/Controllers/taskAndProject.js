import { Project } from "../models/TaskAndProject.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.user.id, // 👈 from authMiddleware
    });

    const saved = await project.save();
    res.status(201).json({ success: true, project: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add Task to Project
export const addTaskToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const task = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    project.tasks.push(task);
    await project.save();

    res.status(200).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// Get Projects of Logged-In HR
export const getMyProjects = async (req, res) => {
  try {
    // HR ka ID from JWT (authMiddleware se)
    const hrId = req.user.id;

    // Sirf us HR ke projects fetch karo
    const projects = await Project.find({ createdBy: hrId })
      .populate("employees", "name email")         // employees ka name/email
      .populate("createdBy", "name email")        // HR ka name/email
      .populate("tasks.assignedTo", "name email"); // tasks me assigned employee

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No projects found for this HR",
      });
    }
console.log(JSON.stringify(projects, null, 2));

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    console.error("Error fetching HR projects:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// ✅ Update Project (Employees overwrite hoga)
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params; 
    const updates = { ...req.body };

    // ⚡ Agar employees bheje gaye hain tu puri overwrite karo
    if (updates.employees) {
      updates.employees = [...updates.employees]; 
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId, createdBy: req.user.id }, 
      { $set: updates },  // employees puri tarah replace ho jayenge
      { new: true, runValidators: true }
    )
      .populate("employees", "name email")
      .populate("createdBy", "name email")
      .populate("tasks.assignedTo", "name email");

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: "Project not found or not authorized" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Project updated successfully", 
      project 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// ✅ Delete Project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Sirf wo project delete karne ka access jo is HR ne create kiya ho
    const deleted = await Project.findOneAndDelete({
      _id: projectId,
      createdBy: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Project not found or not authorized" });
    }

    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




// ✅ Update Task in Project
export const updateTaskInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const updates = req.body;

    // Project find karo
    const project = await Project.findOne({ _id: projectId, createdBy: req.user.id });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found or not authorized" });
    }

    // Task find karo
    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found in this project" });
    }

    // Fields update karo
    Object.keys(updates).forEach((key) => {
      task[key] = updates[key];
    });

    await project.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      project,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// ✅ Delete Task from Project
export const deleteTaskFromProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    // Project find karo
    const project = await Project.findOne({ _id: projectId, createdBy: req.user.id });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found or not authorized" });
    }

    // Task remove karo
    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found in this project" });
    }

    task.deleteOne(); // subdocument remove
    await project.save();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      project,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




export const getEmployeeProjectsAndTasks = async (req, res) => {
  try {
    const employeeId = req.user.id; // JWT se logged in employee ka id

    // Step 1: Projects fetch karo jo is employee ko assigned hain
    const projects = await Project.find({ employees: employeeId })
      .populate("employees", "name email")          // ✅ all employees names/emails
      .populate("tasks.assignedTo", "name email"); // ✅ task assigned employees

    // Step 2: Har project ke andar sirf us employee ke tasks filter karo
    const filteredProjects = projects.map((project) => {
      const myTasks = project.tasks.filter(
        (task) => task.assignedTo && task.assignedTo._id.toString() === employeeId
      );

      return {
        _id: project._id,
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        priority: project.priority,

        // ✅ Show all employees (not only loggedIn user)
        employees: project.employees.map((emp) => ({
          _id: emp._id,
          name: emp.name,
          email: emp.email,
        })),

        // ✅ Tasks sirf loggedIn employee ke
        tasks: myTasks.length > 0 ? myTasks : [],
      };
    });

    res.json({ success: true, projects: filteredProjects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

