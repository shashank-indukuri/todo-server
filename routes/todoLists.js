var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const TodoList = require("../models/TodoList");
const Todo = require("../models/Todo");

const privateKey = process.env.JWT_PRIVATE_KEY;

router.use(function (req, res, next) {
  console.log(req.header("Authorization"));
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
  const todoLists = await TodoList.find()
    .where("author")
    .equals(req.payload.id)
    .exec();
  const todosList = todoLists.map((todoList) => ({
    id: todoList._id,
    title: todoList.title,
    description: todoList.description,
    author: todoList.author,
  }));
  console.log(todosList);
  return res.status(200).json({ todoLists: todosList });
});

router.get("/:todoListId", async function (req, res, next) {
  let todos = await Todo.find()
    .where("todoList")
    .equals(req.params.todoListId)
    .exec();

  todos = todos.map((todo) => ({
    id: todo._id,
    title: todo.title,
    description: todo.description,
    dateCreated: todo.dateCreated,
    complete: todo.complete,
    dateCompleted: todo.dateCompleted,
    author: todo.author,
    todoList: todo.todoList,
  }));

  return res.status(200).json({ todos: todos });
});

router.post("/", async function (req, res) {
  const todoList = new TodoList({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
  });

  await todoList
    .save()
    .then((savedTodoList) => {
      console.log(savedTodoList);
      return res.status(201).json({
        id: savedTodoList._id,
        title: savedTodoList.title,
        description: savedTodoList.description,
        author: savedTodoList.author,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

router.delete("/", async function (req, res) {
  await TodoList.findOneAndDelete({
    _id: req.body.id,
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
