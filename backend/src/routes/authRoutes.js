import express from "express";
import { body } from "express-validator";
import { getProfile, loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { handleValidation } from "../utils/validation.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required.")
      .isLength({ min: 2, max: 80 })
      .withMessage("Name must be between 2 and 80 characters."),
    body("email").trim().isEmail().withMessage("Please provide a valid email.").normalizeEmail(),
    body("password")
      .isLength({ min: 6, max: 72 })
      .withMessage("Password must be between 6 and 72 characters.")
  ],
  handleValidation,
  registerUser
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Please provide a valid email.").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required.")
  ],
  handleValidation,
  loginUser
);

router.get("/me", protect, getProfile);
router.post("/logout", protect, logoutUser);

export default router;
