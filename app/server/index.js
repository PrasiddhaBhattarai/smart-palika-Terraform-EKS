// // Civic-Desk
import { config } from "dotenv";
// import express from "express";

config();

import { app } from "./src/app.js"; // your Express app
import redis from "./src/config/redis.js"; // your redis setup
import cors from "cors";

// ===== CORS CONFIG =====
// Allow local dev + production frontend
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000",
  "https://prasiddhabhattarai.com.np",
  "https://www.prasiddhabhattarai.com.np"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // required because your axios uses withCredentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ===== EXPRESS JSON =====
// app.use(express.json());

// ===== PORT =====
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// ===== COMPLAINT CATEGORIES =====
export const complaintCategories = {
  "Roads & Transport": ["potholes", "illegal parking", "accident"],
  "Sanitation": ["garbage", "open drains", "bad smell"],
  "Water Supply": ["no water", "contaminated water"],
  "Power": ["streetlight out", "power cuts"],
  "Health": ["dead animals"],
  "Environment": ["pollution", "noise complaints"]
};
jljsgkljsa
sljf