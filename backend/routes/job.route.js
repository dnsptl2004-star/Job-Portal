import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

// Create a new job (admin only)
router.post("/", isAuthenticated, postJob);

// Public job listings for dashboard/jobs page
router.get("/", getAllJobs);

// Get all jobs created by the authenticated admin
router.get("/admin", isAuthenticated, getAdminJobs);

// Public job details page
router.get("/:id", getJobById);

export default router;
