import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// ---------------- Cookie Options ----------------
const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000,
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered", success: false });
    }

    let profilePhoto = "";
    if (req.files?.profilePhoto?.[0]) {
      const fileUri = getDataUri(req.files.profilePhoto[0]);
      const upload = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = upload.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDoc = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: { profilePhoto },
    });

    const token = jwt.sign({ userId: userDoc._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res.status(201).cookie("token", token, cookieOpts).json({
      message: "Account created successfully",
      user: {
        _id: userDoc._id,
        fullname: userDoc.fullname,
        email: userDoc.email,
        phoneNumber: userDoc.phoneNumber,
        role: userDoc.role,
        profile: userDoc.profile,
      },
      success: true,
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const userDoc = await User.findOne({ email }).select("+password");
    if (!userDoc) {
      return res.status(400).json({ message: "Incorrect email or password", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect email or password", success: false });
    }

    if (userDoc.role !== role) {
      return res.status(400).json({ message: "Role mismatch", success: false });
    }

    const token = jwt.sign({ userId: userDoc._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res.status(200).cookie("token", token, cookieOpts).json({
      message: `Welcome back ${userDoc.fullname}`,
      user: {
        _id: userDoc._id,
        fullname: userDoc.fullname,
        email: userDoc.email,
        phoneNumber: userDoc.phoneNumber,
        role: userDoc.role,
        profile: userDoc.profile,
      },
      success: true,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ================= LOGOUT =================
export const logout = async (_req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { ...cookieOpts, maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;

    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (fullname) userDoc.fullname = fullname;
    if (email) userDoc.email = email;
    if (phoneNumber) userDoc.phoneNumber = phoneNumber;
    if (bio !== undefined) userDoc.profile.bio = bio;
    if (skills !== undefined) {
      userDoc.profile.skills = skills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    }

    if (req.files?.profilePhoto?.[0]) {
      const fileUri = getDataUri(req.files.profilePhoto[0]);
      const upload = await cloudinary.uploader.upload(fileUri.content);
      userDoc.profile.profilePhoto = upload.secure_url;
    }

    if (req.files?.resume?.[0]) {
      const fileUri = getDataUri(req.files.resume[0]);
      const upload = await cloudinary.uploader.upload(fileUri.content, { resource_type: "raw" });
      userDoc.profile.resume = upload.secure_url;
      userDoc.profile.resumeOriginalName = req.files.resume[0].originalname;
    }

    await userDoc.save();

    console.log("✅ Updated user profile:", userDoc.profile); // debug log

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: userDoc._id,
        fullname: userDoc.fullname,
        email: userDoc.email,
        phoneNumber: userDoc.phoneNumber,
        role: userDoc.role,
        profile: userDoc.profile,
      },
      success: true,
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
