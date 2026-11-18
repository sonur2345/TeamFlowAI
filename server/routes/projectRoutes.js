import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// All routes below require login
router.use(protect);

router.route("/")
  .post(createProject)
  .get(getProjects);

router.route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;