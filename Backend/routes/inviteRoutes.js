// routes/invite.js
import express from "express";
import crypto from "crypto";
import Invite from "../models/Invite.js";
import { sendInviteEmail } from "../utils/sendEmail.js";
import { getNextSequence } from "../utils/getNextSequence.js";

const router = express.Router();

const makeCompanyCode = (company) => {
  const raw = String(company || "");
  return raw.replace(/[^A-Za-z0-9]/g, "").slice(0, 12).toUpperCase() || "COMP";
};

// Create invite (reservation-on-create)
router.post("/", async (req, res) => {
  try {
   const { role, email } = req.body;
if (!role || !email) return res.status(400).json({ message: "Missing fields" });


    const token = crypto.randomBytes(32).toString("hex");
    const expiryDays = parseInt(process.env.INVITE_EXPIRY_DAYS || "30", 10);
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    // company code (alphanumeric uppercase, limited length)
   const companyCode = "CORPORATE";
    const year = new Date().getFullYear();
    const key = `${companyCode}_${year}`;

    // next sequence (atomic)
    const seq = await getNextSequence(key); // 1,2,3...
    const seqStr = String(seq).padStart(3, "0"); // "001"

    // Build assigned email exactly as requested:
    // <COMPANYCODE>-<YEAR>-<SEQ>@gmail.com
    const assignedEmail = `${companyCode}-${year}-${seqStr}@gmail.com`;

  const invite = await Invite.create({
  company: "Corporate Management System", // fixed display name
  companyCode,
  role,
  email,
  token,
  expiresAt,
  assignedEmail,
  sequenceNumber: seq
});


    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const route = role === "HR" ? "HrRegistrationPage" : "EmployeeRegistrationPage";
    const link = `${clientUrl}/${route}?token=${token}`;

    // send invite email (includes assignedEmail). If your sendInviteEmail supports assignedEmail param update it; else just pass minimal arguments.
    try {
     await sendInviteEmail(
  email,
  link,
  "Corporate Management System", // fixed name instead of 'company'
  role,
  assignedEmail,
  expiresAt
);

    } catch (mailErr) {
      console.error("Mail send error:", mailErr);
      // we still return success because invite created; consider rollback if you prefer
    }

    return res.json({
      message: "Invite created and email sent (if mail succeeded)",
      link,
      assignedEmail,
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Validate token (include assignedEmail in info)
router.get("/validate/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token });
    if (!invite) return res.status(404).json({ valid: false, reason: "Invalid token" });
    if (invite.used) return res.status(400).json({ valid: false, reason: "Already used" });
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return res.status(400).json({ valid: false, reason: "Expired" });
    }
    return res.json({
      valid: true,
      invite: {
        company: invite.company,
        role: invite.role,
        email: invite.email,
        assignedEmail: invite.assignedEmail,
        sequenceNumber: invite.sequenceNumber
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Consume token (mark used) — unchanged except it can verify assignedEmail already reserved
router.post("/consume/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { consumedBy } = req.body; // optional
    const invite = await Invite.findOne({ token });
    if (!invite) return res.status(404).json({ message: "Invalid token" });
    if (invite.used) return res.status(400).json({ message: "Token already used" });
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    invite.used = true;
    invite.consumedAt = new Date();
    if (consumedBy) invite.consumedBy = consumedBy;
    await invite.save();

    return res.json({
      message: "Invite consumed",
      assignedEmail: invite.assignedEmail,
      sequenceNumber: invite.sequenceNumber
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
