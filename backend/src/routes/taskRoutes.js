import express from "express";
import { body, param, query } from "express-validator";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus
} from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";
import { handleValidation } from "../utils/validation.js";

const router = express.Router();

const taskIdValidation = [param("id").isMongoId().withMessage("Invalid task id.")];

const listValidation = [
  query("search").optional().trim().isLength({ max: 120 }).withMessage("Search is too long."),
  query("status").optional().isIn(["pending", "completed"]).withMessage("Invalid status filter."),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number."),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50.")
];

const createValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ min: 2, max: 120 })
    .withMessage("Title must be between 2 and 120 characters."),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters."),
  body("status").optional().isIn(["pending", "completed"]).withMessage("Status must be pending or completed.")
];

const updateValidation = [
  ...taskIdValidation,
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty.")
    .isLength({ min: 2, max: 120 })
    .withMessage("Title must be between 2 and 120 characters."),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters."),
  body("status").optional().isIn(["pending", "completed"]).withMessage("Status must be pending or completed.")
];

const statusValidation = [
  ...taskIdValidation,
  body("status").isIn(["pending", "completed"]).withMessage("Status must be pending or completed.")
];

router.use(protect);

router
  .route("/")
  .get(listValidation, handleValidation, getTasks)
  .post(createValidation, handleValidation, createTask);

router
  .route("/:id")
  .get(taskIdValidation, handleValidation, getTaskById)
  .put(updateValidation, handleValidation, updateTask)
  .delete(taskIdValidation, handleValidation, deleteTask);

router.patch("/:id/status", statusValidation, handleValidation, updateTaskStatus);

export default router;
