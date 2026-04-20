import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

process.on("uncaughtException", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error("Port 5000 is already in use. Stop the old backend process or change PORT in backend/.env.");
    process.exit(1);
  }

  throw error;
});

// ---------- Middlewares ----------
app.use(express.json({ limit: "10mb" }));   // handle JSON payloads
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // handle form-urlencoded
app.use(cookieParser());

// ✅ CORS config (very important for signup/login with cookies)
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,   // allow cookies
}));

// ---------- Routes ----------
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server running at port ${PORT}`);
});
