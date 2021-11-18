var express = require("express");
var router = express.Router();

const User = require("../models/User");
const Todo = require("../models/Todo");

router.get("/", async function (req, res, next) {
  const users = await User.find().exec();
  usersList = users.map((user) => ({
    id: user._id,
    username: user.username,
    todos: user.todos,
  }));
  return res.status(200).json({ users: usersList });
});

router.get("/:userId", async function (req, res, next) {
  const todos = await Todo.find()
    .where("author")
    .equals(req.params.userId)
    .exec();

  todosList = todos.map((todo) => ({
    id: todo._id,
    title: todo.title,
    description: todo.description,
    dateCreated: todo.dateCreated,
    complete: todo.complete,
    dateCompleted: todo.dateCompleted,
    author: todo.author,
  }));

  return res.status(200).json({ todos: todosList });
});

module.exports = router;
