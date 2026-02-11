import express from "express";
import { createTraining,getMyTrainings,deleteTraining,updateTraining } from "../Controllers/trainingController.js";
import { upload } from "../middleware/multer.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// 🧩 Multiple file upload (for resources)
router.post(
  "/create",
  authMiddleware,
  upload.array("resources"), // "resources" → same name used in frontend formData
  createTraining
);



// 📋 Get all Trainings created by this HR
router.get("/my-trainings", authMiddleware, getMyTrainings);
export default router;

router.delete("/delete/:id", authMiddleware, deleteTraining);



router.put(
  "/update/:id",
  authMiddleware,
  upload.array("resources"),
  updateTraining
);