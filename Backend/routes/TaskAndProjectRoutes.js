import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createProject, addTaskToProject,getMyProjects,updateProject,deleteProject,updateTaskInProject,deleteTaskFromProject,getEmployeeProjectsAndTasks} from "../Controllers/taskAndProject.js";

const router = express.Router();

// Create project
router.post("/createProject", authMiddleware, createProject);

// Add task to project
router.post("/:projectId/addTask", authMiddleware, addTaskToProject);


router.get("/my-projects", authMiddleware, getMyProjects);

// ✅ Update Project
router.put("/update/:projectId", authMiddleware, updateProject);
// ✅ Delete Project
router.delete("/delete/:projectId", authMiddleware, deleteProject);



router.put("/updateTask/:projectId/tasks/:taskId", authMiddleware, updateTaskInProject);


router.delete("/deleteTask/:projectId/tasks/:taskId", authMiddleware, deleteTaskFromProject);

router.get("/getEmployeeProjectsAndTasks",authMiddleware,getEmployeeProjectsAndTasks)

export default router;