const asyncHandler = require('express-async-handler'); //Help us get rid of try...catch block

const Task = require('../models/taskModel');
const User = require('../models/userModel');

//-------------------------
// 🔹 Controller for getting all tasks
//-------------------------
const getTasks = asyncHandler(async (req, res) => {
  //Search all tasks created by current user
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json(tasks);
});

//-------------------------
// 🔹 Controller for posting a task
//-------------------------
const setTask = asyncHandler(async (req, res) => {
  //throwing error if body is not from text
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please enter a task');
  }

  //Saving tasks with the current userId
  const task = await Task.create({ text: req.body.text, user: req.user.id });
  res.status(200).json(task);
});

//-------------------------
// 🔹 Controller for updating a task
//-------------------------
const updateTask = asyncHandler(async (req, res) => {
  //Pull task from database
  const task = await Task.findById(req.params.id); //TaskId is passed through params

  if (!task) {
    res.status(400);
    throw new Error('Task not found');
  }

  //Get the corrent user from database
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error('No such user found');
  }

  //Checking if task being updated wasn't created by the current user
  if (task.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User is not authorized to update');
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //return the updated value
  });
  res.status(200).json(updatedTask);
});

//-------------------------
// 🔹 Controller for deleting a task
//-------------------------
const deleteTask = asyncHandler(async (req, res) => {
  //Pull task from database
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(400);
    throw new Error('Task not found');
  }

  //Get the corrent user from database
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error('No such user found');
  }

  //Checking if task being updated wasn't created by the current user
  if (task.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User is not authorized to delete');
  }

  await Task.findByIdAndDelete(req.params.id);
  res.status(200).json({ id: req.params.id });
});

module.exports = { getTasks, setTask, updateTask, deleteTask };
