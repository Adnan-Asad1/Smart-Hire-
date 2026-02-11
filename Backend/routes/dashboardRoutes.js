import express from "express";
import { getDashboardCounts,getLatestPendingRequests } from "../Controllers/dashboardController.js";

const router = express.Router();

// ✅ GET Dashboard counts
router.get("/counts", getDashboardCounts);
router.get("/LatestPendingRequests",getLatestPendingRequests)

export default router;
