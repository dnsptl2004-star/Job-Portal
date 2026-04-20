import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Job description is required"],
        trim: true,
    },
    requirements: {
        type: [String],
        required: [true, "At least one requirement is required"],
        validate: {
            validator: arr => arr.length > 0,
            message: "There must be at least one requirement"
        }
    },
    salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [0, "Salary cannot be negative"],
    },
    experienceLevel: {
        type: Number,
        required: [true, "Experience level is required"],
        min: [0, "Experience level cannot be negative"],
        // Consider adding max if needed, e.g. max: 50
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true,
    },
    jobType: {
        type: String,
        required: [true, "Job type is required"],
        enum: {
            values: ["Full-time", "Part-time", "Contract", "Internship", "Temporary"],
            message: "{VALUE} is not a supported job type"
        }
    },
    position: {
        type: String,  // Changed to String assuming position names e.g. "Senior", "Junior"
        required: [true, "Position is required"],
        trim: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, "Company reference is required"],
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Creator (admin) reference is required"],
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
}, { timestamps: true });

// Add indexes to improve query performance on text searches and company lookups
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ company: 1 });
jobSchema.index({ created_by: 1 });

export const Job = mongoose.model("Job", jobSchema);
