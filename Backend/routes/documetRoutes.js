import express from "express";
import authMiddleware from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";
import {
  uploadDocument,
  getDocuments,
  updateDocumentStatus,
  deleteDocument,
  getPendingDocuments,
  getApprovedDocsByHR,
  getRejectedDocsByHR,
  uploadHRDocument,
  getMyHRDocuments,
  deleteHRDocument,
  getAssignedHRDocuments
} from "../Controllers/documentController.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"), // 👈 multer field name
  uploadDocument
);

router.get("/getDocuments", authMiddleware, getDocuments);
router.put("/status/:id", authMiddleware, updateDocumentStatus);

router.delete("/delete/:id", authMiddleware, deleteDocument); // ✅ delete route

router.get("/pending", authMiddleware, getPendingDocuments);



router.get("/approved/hr", authMiddleware, getApprovedDocsByHR);
router.get("/rejected/hr", authMiddleware, getRejectedDocsByHR);




// ✅ HR Upload Document Route
router.post(
  "/HRDocuments/upload",
  authMiddleware,
  upload.single("file"), // frontend se "file" name ke sath bhejna
  uploadHRDocument
);



// ✅ HR apne hi documents dekh sake
router.get("/HRDocuments/my", authMiddleware, getMyHRDocuments);

// ✅ HR delete their own uploaded document
router.delete("/HRDocuments/delete/:id", authMiddleware, deleteHRDocument);



// ✅ Employee - Get Assigned HR Documents
router.get(
  "/HRDocuments/assigned",
  authMiddleware,
  getAssignedHRDocuments
);


export default router;
