var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const Todo = require("../models/Todo");

const privateKey = process.env.JWT_PRIVATE_KEY;

router.get("/:todoId", async function (req, res, next) {
  let todo = await Todo.findOne().where("_id").equals(req.params.todoId).exec();
  todo = {
    id: todo._id,
    title: todo.title,
    description: todo.description,
    dateCreated: todo.dateCreated,
    complete: todo.complete,
    dateCompleted: todo.dateCompleted,
    author: todo.author,
    todoList: todo.todoList,
  };
  return res.status(200).json(todo);
});

router.use(function (req, res, next) {
  if (req.header("Authorization")) {
    try {
      req.payload = jwt.verify(req.header("Authorization"), privateKey, {
        algorithms: ["RS256"],
      });
      console.log(req.payload);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

router.get("/", async function (req, res, next) {
  const todos = await Todo.find().where("author").equals(req.payload.id).exec();

  const todosList = todos.map((todo) => ({
    id: todo._id,
    title: todo.title,
    description: todo.description,
    dateCreated: todo.dateCreated,
    complete: todo.complete,
    dateCompleted: todo.dateCompleted,
    author: todo.author,
    todoList: todo.todoList,
  }));
  return res.status(200).json({ todos: todosList });
});

router.post("/", async function (req, res) {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    dateCreated: req.body.dateCreated,
    complete: req.body.complete,
    dateCompleted: req.body.dateCompleted,
    author: req.body.author,
    todoList: req.body.todoList,
  });

  await todo
    .save()
    .then((savedTodo) => {
      return res.status(201).json({
        id: savedTodo._id,
        title: savedTodo.title,
        description: savedTodo.description,
        dateCreated: savedTodo.dateCreated,
        complete: savedTodo.complete,
        dateCompleted: savedTodo.dateCompleted,
        author: savedTodo.author,
        todoList: savedTodo.todoList,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

router.patch("/", async function (req, res) {
  await Todo.findOneAndUpdate(
    { $and: [{ _id: req.body.id }, { author: req.body.author }] },
    { complete: req.body.complete, dateCompleted: req.body.dateCompleted },
    { new: true }
  )
    .exec()
    .then((updatedTodo) => {
      return res.status(200).json({
        id: updatedTodo._id,
        complete: updatedTodo.complete,
        dateCompleted: updatedTodo.dateCompleted,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: "Unauthorized" + error.message });
    });
});

router.delete("/", async function (req, res) {
  await Todo.findOneAndDelete({
    $and: [{ _id: req.body.id }, { author: req.body.author }],
  })
    .exec()
    .then((deletedTodo) => {
      if (deletedTodo) {
        return res.status(200).json({ id: req.body.id });
      } else {
        return res.status(500).json({ error: "Unauthorized" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

module.exports = router;
