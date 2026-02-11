import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'
import Invite from '../models/Invite.js'
import crypto from 'crypto';
import { sendResetEmail } from '../utils/sendEmail.js';
import { sendInterviewLinks} from '../utils/sendEmail.js';
import { PendingUser } from "../models/pendingUserModel.js";
// Register
// Register (DIRECT - replaces Pending flow)
export const registerUser = async (req, res) => {
  const { fullName, email, password, hrRole, experience, skills, token } = req.body;

  if (!fullName || !email || !password || !hrRole || !experience || !skills) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // If token provided, try to atomically consume it
    if (token) {
      const now = new Date();
      // Atomically find invite that is unused and not expired and mark it used
      const invite = await Invite.findOneAndUpdate(
        { token, used: false, $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }] },
        { $set: { used: true, consumedAt: now } },
        { new: true }
      );

      if (!invite) {
        return res.status(400).json({ message: "Invalid, already used, or expired invite token" });
      }

    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalize skills: accept either comma-separated string or array
    let skillsArray = [];
    if (Array.isArray(skills)) {
      skillsArray = skills.map(s => typeof s === "string" ? s.trim() : s);
    } else if (typeof skills === "string") {
      skillsArray = skills.split(",").map(s => s.trim());
    }

    // Create user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      hrRole,
      experience,
      skills: skillsArray,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        hrRole: newUser.hrRole,
        experience: newUser.experience,
        skills: newUser.skills
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ✅ Directly Add HR by Admin (no pending approval)
export const createHRByAdmin = async (req, res) => {
  try {
    const { fullName, email, password, hrRole, experience, skills } = req.body;

    // Validation
    if (!fullName || !email || !password || !hrRole || !experience || !skills) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new HR directly in Users collection
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      hrRole,
      experience, // string form (e.g., "Fresh", "2 years")
      skills: skills.split(",").map(s => s.trim()),
    });

    return res.status(201).json({
      message: "HR added successfully by Admin",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        hrRole: newUser.hrRole,
        experience: newUser.experience,
        skills: newUser.skills
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};































// ✅ Get all HR users (Admin view)
export const getAllHRs = async (req, res) => {
  try {
    const users = await User.find({}, "-password -resetToken -resetTokenExpiry").sort({ createdAt: -1 }); 
    // "-" means exclude these fields
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Update HR user (Admin only)
export const updateHR = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, hrRole, experience, skills } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, email, hrRole, experience, skills },
      { new: true, runValidators: true, select: "-password -resetToken -resetTokenExpiry" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "HR user not found" });
    }

    res.status(200).json({ message: "HR updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Delete HR user (Admin only)
export const deleteHR = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "HR user not found" });
    }

    res.status(200).json({ message: "HR deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};




// HR Login
export const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ id: user._id,role: "hr" }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            },
            role:"hr"
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiry = Date.now() + 10 * 60 * 1000; // valid for 10 mins

    user.resetToken = otp;
    user.resetTokenExpiry = expiry;
    await user.save();

    await sendResetEmail(email, otp); // send the 6-digit code

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyOtpAndReset = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.resetToken !== otp || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Send interview link to candidate
export const sendInterviewLinkToCandidate = async (req, res) => {
  const { email, link } = req.body;

  if (!email || !link) {
    return res.status(400).json({ message: "Email and link are required" });
  }

  try {
    await sendInterviewLinks(email, link);
    res.status(200).json({ message: "Interview link sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sending email", error: err.message });
  }
};

// ✅ Get specific HR (with credits)
export const getHRById = async (req, res) => {
  try {
    const { id } = req.params; // frontend se user id aa rahi hogi

    // User ko fetch karo (password & resetToken waqara exclude kar do)
    const user = await User.findById(id, "-password -resetToken -resetTokenExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // response me credits bhi aayenge
    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

