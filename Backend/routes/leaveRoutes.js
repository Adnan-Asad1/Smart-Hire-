import express from "express";
import { Leave } from "../models/Leave.js";
import { Employee } from "../models/Employee.js";
import authMiddleware from "../middleware/auth.js"; // ✅ JWT Auth middleware
import { User } from "../models/userModel.js"; 
import { sendLeaveDecisionEmail } from "../utils/sendEmail.js"; // ✅ NEW Import
const router = express.Router();


const ensureEmployee = (req, res) => {
  if (!req.user || !req.user.role) {
    res.status(403).json({ success: false, message: "Role missing in token. Please login again." });
    return false;
  }
  if (req.user.role !== "employee") {
    res.status(403).json({ success: false, message: "Forbidden: Employees only." });
    return false;
  }
  return true;
};

// 📌 Employee Apply for Leave
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, days, reason } = req.body;

    const newLeave = new Leave({
      employeeId: req.user.id, // employee ID from token
      leaveType,
      fromDate,
      toDate,
      days,
      reason,
    });

    await newLeave.save();
    res.status(201).json({ success: true, message: "Leave applied successfully", leave: newLeave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// 📌 HR - Get all Pending Leave Requests
router.get("/pending", authMiddleware, async (req, res) => {
  try {
    const leaves = await Leave.find({ status: "Pending" })
      .populate("employeeId", "name email") // 👈 Only show employee name + email
      .select("leaveType days status reason employeeId");

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// 📌 HR - Approve/Reject Leave
router.put("/:id/decision", authMiddleware, async (req, res) => {
  try {
    const { decision, rejectReason } = req.body; // ✅ Added rejectReason

    if (!["Approved", "Rejected"].includes(decision)) {
      return res.status(400).json({ success: false, message: "Invalid decision" });
    }

    const leave = await Leave.findById(req.params.id).populate("employeeId", "name email");
    if (!leave)
      return res.status(404).json({ success: false, message: "Leave not found" });

    leave.status = decision;
    leave.approvedBy = req.user.id;
    if (decision === "Rejected") {
      leave.rejectReason = rejectReason || null; // ✅ Store reject reason (optional)
    }

    await leave.save();

    // ✅ Send Email
    await sendLeaveDecisionEmail(
      leave.employeeId.email,
      leave.employeeId.name,
      decision,
      rejectReason
    );

    res.status(200).json({ success: true, message: `Leave ${decision}`, leave });
  } catch (error) {
    console.error("Leave Decision Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});




/* ------------------------------------------
   Employee: Get pending leaves of logged-in employee
   Columns: Leave Type, From, To, Days, Status
   ------------------------------------------ */
router.get("/my/pending", authMiddleware, async (req, res) => {
  if (!ensureEmployee(req, res)) return;

  try {
    const leaves = await Leave.find({
      employeeId: req.user.id,
      status: "Pending",
    })
      .select("leaveType fromDate toDate days status")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* -------------------------------------------------------
   Employee: Get Approved / Rejected leaves of logged-in employee
   Columns: Leave Type, From, To, Days, Status, Approved By (HR name)
   ------------------------------------------------------- */
router.get("/my/history", authMiddleware, async (req, res) => {
  if (!ensureEmployee(req, res)) return;

  try {
    const leaves = await Leave.find({
      employeeId: req.user.id,
      status: { $in: ["Approved", "Rejected"] },
    })
      .select("leaveType fromDate toDate days status approvedBy")
      .populate("approvedBy", "fullName ") // populate HR info
      .sort({ createdAt: -1 });

    // map so front-end gets approvedBy as a friendly string (name/email)
    const result = leaves.map((l) => ({
      _id: l._id,
      leaveType: l.leaveType,
      fromDate: l.fromDate,
      toDate: l.toDate,
      days: l.days,
      status: l.status,
      approvedBy:
        l.approvedBy?.fullName || null,
    }));

    res.status(200).json({ success: true, leaves: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
export default router;
