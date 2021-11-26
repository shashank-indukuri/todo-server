var express = require("express");
var path = require("path");
var logger = require("morgan");

require("dotenv").config();
require("./models/setupMongo")();

var authRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var todosRouter = require("./routes/todos");
var todoListsRouter = require("./routes/todoLists");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/todos", todosRouter);
app.use("/todoLists", todoListsRouter);

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = app;
