import bcrypt from "bcryptjs";
import { Employee } from "../models/Employee.js";
import jwt from 'jsonwebtoken';
import { PendingEmployee } from "../models/PendingEmployee.js";
import  Invite from "../models/Invite.js";
export const registerEmployee = async (req, res) => {
  try {
    const { name, email, designation, experience, skills, password, token } = req.body;

    // Basic validation
    if (!name || !email || !designation || experience === undefined || !skills || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ If invite token used, validate and mark it as consumed (optional)
    if (token) {
      const now = new Date();
      const invite = await Invite.findOneAndUpdate(
        { token, used: false, $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }] },
        { $set: { used: true, consumedAt: now } },
        { new: true }
      );

      if (!invite) {
        return res.status(400).json({
          message: "Invalid, already used, or expired invite token",
        });
      }
    }

    // normalize skills
    let skillsArr = Array.isArray(skills)
      ? skills
      : String(skills).split(",").map((s) => s.trim()).filter(Boolean);

    // Check if already exists
    const existsEmployee = await Employee.findOne({ email });
    if (existsEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // ✅ Save directly in Employee collection (no pending)
    const employee = await Employee.create({
      name,
      email,
      designation,
      experience,
      skills: skillsArr,
      password: hashed,
    });

    // Remove password before sending response
    const { password: _p, ...safe } = employee.toObject();

    // ✅ Generate token for immediate access (optional)
    const accessToken = jwt.sign(
      { id: employee._id, role: "employee" },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Employee registered successfully",
      token: accessToken,
      employee: safe,
    });
  } catch (err) {
    console.error("Register Employee error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};




// ✅ Add Employee directly (Admin only)
export const addEmployee = async (req, res) => {
  try {
    const { name, email, designation, experience, skills, password } = req.body;

    if (!name || !email || !designation || experience === undefined || !skills || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // normalize skills
    let skillsArr = Array.isArray(skills)
      ? skills
      : String(skills).split(",").map(s => s.trim()).filter(Boolean);

    // Check if already exists
    const existsEmployee = await Employee.findOne({ email });
    if (existsEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save directly in Employee collection
    const employee = await Employee.create({
      name,
      email,
      designation,
      experience,
      skills: skillsArr,
      password: hashed,
    });

    // return safe data
    const { password: _p, ...safe } = employee.toObject();

    return res.status(201).json({
      message: "Employee added successfully by Admin",
      employee: safe,
    });
  } catch (err) {
    console.error("Add Employee error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};








// ✅ Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    // sirf safe fields bhejna (password hata kar)
    const employees = await Employee.find({}, { password: 0 });

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    return res.status(200).json({
      message: "Employees fetched successfully",
      employees
    });
  } catch (err) {
    console.error("Get Employees error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};




// ✅ Update Employee (Admin can edit)
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params; // employee _id
    const { name, email, designation, experience, skills } = req.body;

    // normalize skills
    let skillsArr = Array.isArray(skills)
      ? skills
      : String(skills).split(",").map(s => s.trim()).filter(Boolean);

    const updated = await Employee.findByIdAndUpdate(
      id,
      { name, email, designation, experience, skills: skillsArr },
      { new: true, projection: { password: 0 } } // return updated doc without password
    );

    if (!updated) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee updated successfully", employee: updated });
  } catch (err) {
    console.error("Update Employee error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ✅ Delete Employee (Admin can remove)
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Employee.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Delete Employee error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};







// ✅ Employee Login
export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: employee._id, role: "employee" },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" } // employee token for 7 days
    );

    // return safe employee data (without password)
    const { password: _p, ...safe } = employee.toObject();

    return res.status(200).json({
      message: "Login successful",
      token,
      employee: safe,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};