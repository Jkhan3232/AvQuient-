import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required."],
      trim: true,
      minlength: [2, "Task title must be at least 2 characters."],
      maxlength: [120, "Task title cannot exceed 120 characters."]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters."],
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, status: 1, createdAt: -1 });
taskSchema.index({ userId: 1, title: "text", description: "text" });

const Task = mongoose.model("Task", taskSchema);

export default Task;
