import { connectDB } from "../config/db.js";
import mongoose from "mongoose";

// Middleware to ensure DB connection before handling requests
export const ensureDBConnection = async (req, res, next) => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return next();
    }
    
    // Connect if not already connected
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({
      error: "Database connection failed",
      message: "Unable to connect to the database. Please try again later.",
    });
  }
};

