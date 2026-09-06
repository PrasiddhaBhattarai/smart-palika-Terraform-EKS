//server/src/routes/auth_routes.js
import express from "express";
import { query as db } from '../config/db.js';
import { authMiddleware } from "../middlewares/auth_middleware.js";
import {
    requestVerificationCode,
    verifyCodeAndRegister,
    loginUser,
    changePassword,
    requestPasswordReset,
    resetPassword,
    logoutUser,
    getUser
} from "../controllers/auth_controller.js"

const router = express.Router();

router.post("/register", requestVerificationCode);
router.post("/register-verify", verifyCodeAndRegister);

router.post("/login", loginUser);

router.post("/change-password", authMiddleware, changePassword);

router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

router.post("/logout", logoutUser);

router.get("/user/:id", authMiddleware, getUser);
router.get('/count', authMiddleware, async (req, res) => {
  try {
    const result = await db(`SELECT COUNT(*) AS total_users FROM users`);
    const totalUsers = parseInt(result.rows[0].total_users, 10);
    res.json({ success: true, totalUsers });
  } catch (err) {
    console.error('Error fetching total users:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


export default router;