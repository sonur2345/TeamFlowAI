
import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// All task routes require login
router.use(protect);

// Create a task
router.post("/", createTask);

// Get all tasks of a project
router.get("/project/:projectId", getProjectTasks);

// Update a task
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

export default router;
