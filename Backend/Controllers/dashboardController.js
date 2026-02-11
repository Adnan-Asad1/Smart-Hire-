import { User } from "../models/userModel.js";
import { Employee } from "../models/Employee.js";
import { PendingEmployee } from "../models/PendingEmployee.js";
import { PendingUser } from "../models/pendingUserModel.js";
import { Interview } from "../models/Interview.js";
import { Conversation } from "../models/Conversation.js";
// ✅ Get Dashboard Counts
export const getDashboardCounts = async (req, res) => {
  try {
    // HRs count
    const hrCount = await User.countDocuments();

    // Employees count
    const employeesCount = await Employee.countDocuments();

    // Pending Employees count
    const pendingEmployeesCount = await PendingEmployee.countDocuments();

    // Pending Users count
    const pendingUsersCount = await PendingUser.countDocuments();

    // Total pending requests (both employees + users)
    const pendingRequests = pendingEmployeesCount + pendingUsersCount;

    // Interviews count
    const interviewsCount = await Interview.countDocuments();
    const completedInterview=await Conversation.countDocuments();

    res.status(200).json({
      success: true,
      counts: {
        hrCount,
        employeesCount,
        pendingEmployeesCount,
        pendingUsersCount,
        pendingRequests,
        interviewsCount,
        completedInterview,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching dashboard counts",
      error: error.message,
    });
  }
};


// ✅ Get latest two pending requests
export const getLatestPendingRequests = async (req, res) => {
  try {
    // Get latest pending users & employees
    const latestUsers = await PendingUser.find()
      .sort({ createdAt: -1 })
      .limit(2);

    const latestEmployees = await PendingEmployee.find()
      .sort({ createdAt: -1 })
      .limit(2);

    let results = [];

    if (latestUsers.length === 0 && latestEmployees.length > 0) {
      // Case 1: Only employees pending → take 2 employees
      results = latestEmployees.slice(0, 2).map(emp => ({
        name: emp.name,
        role: "Employee",
        status: "Pending",
        requestedOn: emp.createdAt,
      }));
    } else if (latestUsers.length > 0 && latestEmployees.length > 0) {
      // Case 2: Both exist → take 1 from each
      results = [
        {
          name: latestUsers[0].fullName,
          role: "HR",
          status: "Pending",
          requestedOn: latestUsers[0].createdAt,
        },
        {
          name: latestEmployees[0].name,
          role: "Employee",
          status: "Pending",
          requestedOn: latestEmployees[0].createdAt,
        },
      ];
    } else if (latestEmployees.length === 0 && latestUsers.length > 0) {
      // Case 3: Only users pending → take 2 users
      results = latestUsers.slice(0, 2).map(user => ({
        name: user.fullName,
        role: "HR",
        status: "Pending",
        requestedOn: user.createdAt,
      }));
    } else {
      // No pending requests at all
      results = [];
    }

    res.status(200).json({
      success: true,
      pendingRequests: results,
    });
  } catch (error) {
    console.error("Error fetching latest pending requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching latest pending requests",
      error: error.message,
    });
  }
};