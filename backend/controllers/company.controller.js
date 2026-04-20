import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// ========== REGISTER COMPANY ==========
export const registerCompany = async (req, res) => {
  try {
    const companyName = req.body.companyName?.trim();
    if (!companyName) {
      return res.status(400).json({ message: "Company name is required.", success: false });
    }

    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists.", success: false });
    }

    const newCompany = await Company.create({ name: companyName, userId: req.id });

    return res.status(201).json({ message: "Company registered successfully.", company: newCompany, success: true });
  } catch (error) {
    console.error("❌ Error while registering company:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ========== GET ALL COMPANIES ==========
export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id });
    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.error("❌ Error while fetching companies:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ========== GET COMPANY BY ID ==========
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found.", success: false });
    }
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.error("❌ Error while fetching company by ID:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ========== UPDATE COMPANY ==========
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const updateData = {};

    if (name?.trim()) updateData.name = name.trim();
    if (description?.trim()) updateData.description = description.trim();
    if (website?.trim()) updateData.website = website.trim();
    if (location?.trim()) updateData.location = location.trim();

    if (req.file) {
      try {
        const fileUri = getDataUri(req.file);
        const cloudUpload = await cloudinary.uploader.upload(fileUri.content);
        updateData.logo = cloudUpload.secure_url;
      } catch (err) {
        console.error("❌ Logo upload failed:", err?.message || err);
        return res.status(500).json({ message: "Logo upload failed.", success: false });
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found.", success: false });
    }

    return res.status(200).json({ message: "Company information updated successfully.", company: updatedCompany, success: true });
  } catch (error) {
    console.error("❌ Error while updating company:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
