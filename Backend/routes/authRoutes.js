import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Protected route (authentication)
router.get("/current", protect, getCurrentUser);

// Role-based protected route (example: only admin can access this)
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

export default router;
