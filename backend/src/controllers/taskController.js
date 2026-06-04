import Task from "../models/Task.js";
import asyncHandler from "../utils/asyncHandler.js";
import { escapeRegex } from "../utils/validation.js";

const buildTaskQuery = (userId, { search, status }) => {
  const query = { userId };

  if (status && ["pending", "completed"].includes(status)) {
    query.status = status;
  }

  if (search) {
    const safeSearch = escapeRegex(search.trim());
    query.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } }
    ];
  }

  return query;
};

const getTaskStats = async (userId) => {
  const stats = await Task.aggregate([
    { $match: { userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const totals = stats.reduce(
    (acc, item) => {
      acc[item._id] = item.count;
      acc.total += item.count;
      return acc;
    },
    { total: 0, pending: 0, completed: 0 }
  );

  return totals;
};

export const getTasks = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 6, 1), 50);
  const skip = (page - 1) * limit;
  const query = buildTaskQuery(req.user._id, req.query);

  const [tasks, total, stats] = await Promise.all([
    Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(query),
    getTaskStats(req.user._id)
  ]);

  res.status(200).json({
    success: true,
    tasks,
    pagination: {
      total,
      page,
      limit,
      pages: Math.max(Math.ceil(total / limit), 1)
    },
    stats
  });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    task
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;

  const task = await Task.create({
    title,
    description,
    status: status || "pending",
    userId: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    task
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const updates = {};

  ["title", "description", "status"].forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (!Object.keys(updates).length) {
    const error = new Error("Please provide at least one field to update.");
    error.statusCode = 400;
    throw error;
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    task
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully."
  });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { status },
    { new: true, runValidators: true }
  );

  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: `Task marked as ${status}.`,
    task
  });
});
