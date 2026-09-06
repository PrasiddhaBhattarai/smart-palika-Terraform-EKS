import express from "express";
import { query, testConnection } from "./config/db.js";
import authRoutes from "./routes/auth_routes.js";
import cookieParser from "cookie-parser";
import complaintRoutes from "./routes/complaint_routes.js";
import averageRatingRoutes from "./routes/avg_ward_rating_routes.js";
import cors from "cors"; // Add this import
import wardRoutes from './routes/ward_routes.js';
import testRoutes from './routes/test.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Health check 
app.get("/health", async(req, res) => {
  try {
    const dbOk = await testConnection();

    if (dbOk) {
      return res.status(200).json({ status: "ok" });
    }

    return res.status(503).json({
      status: "error",
      message: "Database unavailable",
    });
  } catch (error) {
    return res.status(503).json({
      status: "error",
      message: "Health check failed",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/rating", averageRatingRoutes);
app.use('/api/ward', wardRoutes);
app.use('/api', testRoutes);


export { app };