import mongoose, { Schema, model, models } from "mongoose";

const TaskSchema = new Schema({
  title: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  status: {
    type: String,
    enum: ["to-do", "in-progress", "done"],
    default: "to-do",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Task = models.Task || model("Task", TaskSchema);
export default Task;
