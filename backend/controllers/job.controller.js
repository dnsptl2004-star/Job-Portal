import { Job } from "../models/job.model.js";

// Admin posts a job
export const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
    const userId = req.id;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(",").map(req => req.trim()),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true
    });

  } catch (error) {
    console.error("Error in postJob:", error);
    return res.status(500).json({
      message: "Server error while creating job.",
      success: false
    });
  }
};

// Get all jobs for students, supports keyword search
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found.",
        success: false
      });
    }

    return res.status(200).json({
      jobs,
      success: true
    });

  } catch (error) {
    console.error("Error in getAllJobs:", error);
    return res.status(500).json({
      message: "Server error while fetching jobs.",
      success: false
    });
  }
};

// Get job details by id (for students)
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false
      });
    }

    const job = await Job.findById(jobId)
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
          select: "name email" // select only necessary fields
        }
      })
      .populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    return res.status(200).json({
      job,
      success: true
    });

  } catch (error) {
    console.error("Error in getJobById:", error);
    return res.status(500).json({
      message: "Server error while fetching job.",
      success: false
    });
  }
};

// Get jobs created by admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    if (!adminId) {
      return res.status(400).json({
        message: "Admin ID is required.",
        success: false
      });
    }

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found for this admin.",
        success: false
      });
    }

    return res.status(200).json({
      jobs,
      success: true
    });

  } catch (error) {
    console.error("Error in getAdminJobs:", error);
    return res.status(500).json({
      message: "Server error while fetching admin jobs.",
      success: false
    });
  }
};
