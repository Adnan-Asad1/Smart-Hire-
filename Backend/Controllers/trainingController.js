import { Training } from "../models/Training.js";
import path from "path";
import fs from "fs";
// 🎯 Create new training
export const createTraining = async (req, res) => {
  try {
    // 📦 1. Extract fields from frontend
    const {
      title,
      description,
      type,
      startDate,
      endDate,
      duration,
      trainerName,
      trainerEmail,
      assignedEmployees,
      links,
      status,
      progress,
    } = req.body;

    // 🧠 2. Handle assignedEmployees (convert from JSON string if sent as string)
    let employeesArray = [];
    if (typeof assignedEmployees === "string") {
      employeesArray = JSON.parse(assignedEmployees);
    } else if (Array.isArray(assignedEmployees)) {
      employeesArray = assignedEmployees;
    }

    // 🧮 3. Calculate enrolled = number of assigned employees
    const enrolledCount = employeesArray.length;

    // 📂 4. Handle uploaded files (from multer)
    let resourcesArray = [];
    if (req.files && req.files.length > 0) {
      resourcesArray = req.files.map((file) => ({
        name: file.originalname,
        url: `/uploads/documents/${path.basename(file.path)}`,
      }));
    }

    // 🔐 5. Get createdBy (HR user) from auth middleware
    const createdBy = req.user?.id;
// 🧠 Handle links safely (parse if string)
let parsedLinks = [];
if (typeof links === "string") {
  try {
    parsedLinks = JSON.parse(links);
  } catch (e) {
    parsedLinks = [links]; // fallback for single link
  }
} else if (Array.isArray(links)) {
  parsedLinks = links;
}
    // 🧾 6. Create new training document
    const newTraining = new Training({
      title,
      description,
      type,
      startDate,
      endDate,
      duration,
      trainerName,
      trainerEmail,
      assignedEmployees: employeesArray,
     links: parsedLinks,
      enrolled: enrolledCount,
      resources: resourcesArray,
      status,
      progress,
      createdBy,
    });

    // 💾 7. Save to MongoDB
    await newTraining.save();

    res.status(201).json({
      success: true,
      message: "Training created successfully!",
      data: newTraining,
    });
  } catch (error) {
    console.error("❌ Error creating training:", error);
    res.status(500).json({
      success: false,
      message: "Error creating training.",
      error: error.message,
    });
  }
};





// 🎯 Get all trainings created by the logged-in HR
export const getMyTrainings = async (req, res) => {
  try {
    // 🔐 HR ID from authMiddleware (decoded JWT)
    const hrId = req.user?.id;

    if (!hrId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No HR ID found in token.",
      });
    }

    // 📦 Fetch only trainings created by this HR
    const trainings = await Training.find({ createdBy: hrId })
      .populate("assignedEmployees", "name email department") // 👈 optional: show employee details
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      message: "Trainings fetched successfully.",
      count: trainings.length,
      data: trainings,
    });
  } catch (error) {
    console.error("❌ Error fetching trainings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching trainings.",
      error: error.message,
    });
  }
};




// 🗑️ Delete a specific training (only if created by logged-in HR)
export const deleteTraining = async (req, res) => {
  try {
    const hrId = req.user?.id; // 🔐 Logged-in HR ID
    const { id } = req.params; // 🆔 Training ID from route

    if (!hrId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: HR ID not found in token.",
      });
    }

    // 🔍 1. Find the training by ID
    const training = await Training.findById(id);

    if (!training) {
      return res.status(404).json({
        success: false,
        message: "Training not found.",
      });
    }

    // 🚫 2. Check if this HR created it
    if (training.createdBy.toString() !== hrId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own trainings.",
      });
    }

    // 🧹 3. Delete associated resource files (if any)
    if (training.resources && training.resources.length > 0) {
      training.resources.forEach((file) => {
        try {
          // Build absolute path
          const filePath = path.join(process.cwd(), file.url);
          // Remove the file if exists
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted file: ${filePath}`);
          }
        } catch (err) {
          console.warn("⚠️ Error deleting file:", err.message);
        }
      });
    }

    // 🧾 4. Delete training record from MongoDB
    await Training.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Training and its resources deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Error deleting training:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting training.",
      error: error.message,
    });
  }
};




// ✏️ Update existing training with smart resource update
export const updateTraining = async (req, res) => {
  try {
    const hrId = req.user?.id; // 🔐 Logged-in HR ID
    const { id } = req.params; // 🆔 Training ID from route

    if (!hrId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: HR ID not found in token.",
      });
    }

    // 🔍 1. Find existing training
    const training = await Training.findById(id);
    if (!training) {
      return res.status(404).json({
        success: false,
        message: "Training not found.",
      });
    }

    // 🚫 2. Verify ownership
    if (training.createdBy.toString() !== hrId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own trainings.",
      });
    }

    // 📦 3. Extract updated fields from frontend
    const {
      title,
      description,
      type,
      startDate,
      endDate,
      duration,
      trainerName,
      trainerEmail,
      assignedEmployees,
      links,
      status,
      progress,
      existingResources, // 🆕 Array of resources user decided to keep
    } = req.body;


     // 🧠 Handle links safely before updating
let parsedLinks = [];
if (typeof links === "string") {
  try {
    parsedLinks = JSON.parse(links);
  } catch (e) {
    parsedLinks = [links];
  }
} else if (Array.isArray(links)) {
  parsedLinks = links;
}
    // 🧠 4. Handle assignedEmployees
    let employeesArray = [];
    if (typeof assignedEmployees === "string") {
      employeesArray = JSON.parse(assignedEmployees);
    } else if (Array.isArray(assignedEmployees)) {
      employeesArray = assignedEmployees;
    }
    const enrolledCount = employeesArray.length;

    // 🧠 5. Handle existingResources (coming from frontend)
    // Frontend will send the list of still-present (kept) resources.
    let keptResources = [];
    if (typeof existingResources === "string") {
      keptResources = JSON.parse(existingResources);
    } else if (Array.isArray(existingResources)) {
      keptResources = existingResources;
    }

    // 🗑️ 6. Detect and delete removed resources (from server)
    const removedResources = training.resources.filter(
      (oldFile) =>
        !keptResources.some((keepFile) => keepFile.url === oldFile.url)
    );

    removedResources.forEach((file) => {
      try {
        const filePath = path.join(process.cwd(), file.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Deleted removed file: ${filePath}`);
        }
      } catch (err) {
        console.warn("⚠️ Error deleting removed file:", err.message);
      }
    });

    // 📂 7. Handle new uploaded files (from multer)
    let newUploadedResources = [];
    if (req.files && req.files.length > 0) {
      newUploadedResources = req.files.map((file) => ({
        name: file.originalname,
        url: `/uploads/documents/${path.basename(file.path)}`,
      }));
    }

    // 🧩 8. Merge kept + new files
    const finalResources = [...keptResources, ...newUploadedResources];

    // 🧱 9. Update training fields
    training.title = title || training.title;
    training.description = description || training.description;
    training.type = type || training.type;
    training.startDate = startDate || training.startDate;
    training.endDate = endDate || training.endDate;
    training.duration = duration || training.duration;
    training.trainerName = trainerName || training.trainerName;
    training.trainerEmail = trainerEmail || training.trainerEmail;
    training.assignedEmployees =
      employeesArray.length > 0
        ? employeesArray
        : training.assignedEmployees;
    training.links = parsedLinks.length > 0 ? parsedLinks : training.links;
    training.status = status || training.status;
    training.progress = progress || training.progress;
    training.enrolled = enrolledCount;
    training.resources = finalResources; // ✅ Smart update

    // 💾 10. Save updated document
    const updatedTraining = await training.save();

    res.status(200).json({
      success: true,
      message:
        "Training updated successfully (removed files deleted, new added).",
      data: updatedTraining,
    });
  } catch (error) {
    console.error("❌ Error updating training:", error);
    res.status(500).json({
      success: false,
      message: "Error updating training.",
      error: error.message,
    });
  }
};