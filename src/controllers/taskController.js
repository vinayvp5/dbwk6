const Task = require("../models/Task");

// CREATE
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      status: req.body.status,
      contact: req.body.contact,
      description: req.body.description,
      version: req.body.version,
      user: req.user.userId
    });

    await task.save();
    res.json(task);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.userId });
  res.json(tasks);
};

// GET BY ID
exports.getTaskById = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.userId
  });
  res.json(task);
};

// UPDATE
exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    req.body,
    { new: true }
  );
  res.json(task);
};

// DELETE
exports.deleteTask = async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId
  });
  res.json({ message: "Deleted" });
};