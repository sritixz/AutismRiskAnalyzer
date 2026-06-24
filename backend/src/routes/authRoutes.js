import express from "express";
import {
  signup,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);

export default router;
