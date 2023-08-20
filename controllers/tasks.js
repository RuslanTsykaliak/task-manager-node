const Task = require('../models/Task.js');
const asyncWrapper = require('../middleware/async.js');
const { createCustomError } = require('../errors/custom-error.js');

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

const createTask = asyncWrapper(async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new CustomAPIError(400, error.message));
    } else {
      return next(new CustomAPIError(500, 'Something went wrong'));
    }
  }
});

const getTask = asyncWrapper(async (req, res, next) => {
  try {
    const { id: taskID } = req.params;
    const task = await Task.findOne({ _id: taskID });
    if (!task) {
      return next(createCustomError(`No task with id: ${taskID}`, 404));
    }
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
});

const deleteTask = asyncWrapper(async (req, res, next) => {
  try {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskID });
    if (!task) {
      return next(createCustomError(`No task with id: ${taskID}`, 404));
    }
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
});

const updateTask = asyncWrapper(async (req, res, next) => {
  try {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: taskID },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!task) {
      return next(createCustomError(`No task with id: ${taskID}`, 404));
    }
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
