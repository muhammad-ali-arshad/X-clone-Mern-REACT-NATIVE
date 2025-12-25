import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";
import { ensureDBConnection } from "./middleware/db.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Clerk middleware - handles authentication
try {
  app.use(clerkMiddleware());
} catch (error) {
  console.error("Clerk middleware initialization error:", error);
  // Continue without Clerk in case of misconfiguration (for debugging)
}

// Arcjet middleware - rate limiting and security
app.use(arcjetMiddleware);

// Health check route (no DB needed)
app.get("/", (req, res) => res.send("Hello from server"));
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV || "development",
  });
});

// All API routes require DB connection
app.use("/api/users", ensureDBConnection, userRoutes);
app.use("/api/posts", ensureDBConnection, postRoutes);
app.use("/api/comments", ensureDBConnection, commentRoutes);
app.use("/api/notifications", ensureDBConnection, notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  // Don't leak error details in production
  const message = ENV.NODE_ENV === "production" 
    ? "Internal server error" 
    : err.message || "Internal server error";
  res.status(err.status || 500).json({ error: message });
});

// Only start server in local development
if (ENV.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(ENV.PORT || 3000, () => {
        console.log("Server is up and running on PORT:", ENV.PORT || 3000);
      });
    } catch (error) {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    }
  };
  startServer();
}

// Export for Vercel serverless
export default app;