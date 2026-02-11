import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

const router = express.Router();

// 🌟 Seed one admin in DB if not exists
// 🌟 Seed one admin in DB if not exists
router.post("/seed-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if any admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({ message: "❌ Only one admin is allowed. Admin already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();
    res.status(201).json({ message: "✅ Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
});


// 🌟 Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      "supersecretkey", // 🔑 change in production
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin logged in successfully",
      token,
      role: "admin",
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

export default router;
