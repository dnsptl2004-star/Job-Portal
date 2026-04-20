import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String, // Storing as string avoids numeric casting issues and preserves formatting
      required: [true, "Phone number is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Exclude password field from queries by default for security
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: [true, "Role is required"],
    },
    profile: {
      bio: { type: String, default: "" },
      skills: { type: [String], default: [] },
      resume: { type: String, default: "" }, // URL to resume file
      resumeOriginalName: { type: String, default: "" }, // Original filename of resume
      profilePhoto: { type: String, default: "" }, // URL to profile photo
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Ensure profile is always an object to avoid potential null reference errors
userSchema.pre("save", function (next) {
  if (!this.profile) {
    this.profile = {};
  }
  next();
});

export const User = mongoose.model("User", userSchema);
