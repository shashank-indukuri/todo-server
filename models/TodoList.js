const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TodoListSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

//Export model
module.exports = mongoose.model("TodoList", TodoListSchema);
