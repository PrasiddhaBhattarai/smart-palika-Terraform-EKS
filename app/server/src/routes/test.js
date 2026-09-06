import express from "express";
import { findWardFromLocation } from "../utils/ward_locator.js"; // adjust path if needed

const router = express.Router();

// Test endpoint
router.post("/ward", async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng are required" });
  }

  try {
    const ward = await findWardFromLocation(lat, lng);
    if (!ward) return res.json({ message: "Location not in any ward" });
    res.json({ ward });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
