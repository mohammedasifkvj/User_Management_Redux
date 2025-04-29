import bcryptjs from 'bcryptjs';

import User from '../models/userModel.js';
import Task from '../models/taskModel.js';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// update user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// delete user
export const deleteAccount = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token').status(200).json({ message: 'Your account has been Deleted Successfully' });
  } catch (error) {
    next(error);
  }
}

//fetch tasks
export const fetchTasks=async (req,res)=>{
  const {userId}=req.params;
  // console.log("userId",userId);
  try {
      const tasks = await Task.find({ userId: userId});
      if (tasks && tasks.length > 0) {
        res.status(200).json({ success: true, tasks });
      } else {
        res.status(404).json({ success: false, message: 'No tasks found you' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
}

// task status change
export const updateTaskStatus = async (req, res) => {
try {
  // console.log("params",req.params);
  const { taskId } = req.params;
  const { status } = req.body;

  // Validate that the new status is 'completed'
  if (status !== 'completed') {
    return res.status(400).json({ success: false, message: 'Invalid status update. Only "completed" is allowed.' });
  }

  // Find the task by its ID
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  // Only allow update if the current status is 'pending'
  if (task.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Task status cannot be updated. It is either overdue or already completed.' });
  }

  task.status = status;
  await task.save();

  return res.status(200).json({ success: true, task });
} catch (error) {
  console.error('Error updating task status:', error);
  return res.status(500).json({ success: false, message: 'Server error.' });
}
};