import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/taskSchema.js";

export const createTask = catchAsyncErrors(async (req, res, next) => {
  const { title, description, dueDate } = req.body;
  const createdBy = req.user._id;

  // Check if dueDate is provided and is not earlier than current date
  if (dueDate && new Date(dueDate) < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Due date cannot be earlier than the current date",
    });
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    createdBy,
  });

  res.status(200).json({
    success: true,
    task,
    message: "Task Created",
  });
});

export const deleteTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) {
    return next(new ErrorHandler("Task not found!", 400));
  }
  await task.deleteOne();
  res.status(200).json({
    success: true,
    message: "Task Deleted!",
  });
});
export const updateTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user._id;

  let task = await Task.findById(id);
  if (!task) {
    return next(new ErrorHandler("Task not found!", 400));
  }
  task = await Task.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  const tasks = await Task.find({ createdBy: user });

  console.log(task)
  res.status(200).json({
    success: true,
    message: "Task Updated!",
    task,
    tasks
  });
});
export const getMyTask = catchAsyncErrors(async (req, res, next) => {
  const user = req.user._id;
  const tasks = await Task.find({ createdBy: user });
  res.status(200).json({
    success: true,
    tasks,
  });
});
export const getSingleTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let task = await Task.findById(id);
  if (!task) {
    return next(new ErrorHandler("Task not found!", 400));
  }
  res.status(200).json({
    success: true,
    task,
  });
});
