import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleLogoUpload } from "../middlewares/multer.js"; // ✅ Correct middleware

const router = express.Router();

// Register company (no file upload)
router.post("/register", isAuthenticated, registerCompany);

// Get all companies by logged-in user
router.get("/get", isAuthenticated, getCompany);

// Get specific company by ID
router.get("/get/:id", isAuthenticated, getCompanyById);

// Update company info with logo upload
router.put("/update/:id", isAuthenticated, singleLogoUpload, updateCompany); // ✅ singleLogoUpload

export default router;
