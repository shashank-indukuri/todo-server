const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dateCreated: { type: Number, required: true },
  complete: { type: Boolean, required: true },
  dateCompleted: { type: Number },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  todoList: { type: Schema.Types.ObjectId, ref: "TodoList" },
});

//Export model
module.exports = mongoose.model("Todo", TodoSchema);
