import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import resumeRoutes from './routes/resume.js';
import interviewRoutes from './routes/interviewRoutes.js';
import cookieParser from 'cookie-parser';
import takeInterview from './routes/takeInterview.js'
import { sendInterviewLinks } from './utils/sendEmail.js'
import employeeRoutes from "./routes/employeeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import paymentRoutes from "./routes/paymentRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js"
import TasKAndProjectRoutes from "./routes/TaskAndProjectRoutes.js"
import documentRoutes from "./routes/documetRoutes.js"
import trainingRoutes from "./routes/trainingRoutes.js"
import inviteRoutes from "./routes/inviteRoutes.js";
import path from "path";
import { getRealtimeToken } from "./utils/assemblyRealtimeSocket.js";
dotenv.config()
const app = express()

// DB Connection
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/audio', express.static('public/audio'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/resume', resumeRoutes);
app.use('/api/ConductInterview',takeInterview);
app.use("/api/employees", employeeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/leave",leaveRoutes);
app.use("/api/project",TasKAndProjectRoutes);
app.use("/api/documents",documentRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/trainings",trainingRoutes);
app.get("/api/realtime-token", getRealtimeToken);
const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});