const mongoose = require("mongoose");
const { usersDB } = require("../database/connection");

// User Schema
const usersSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = usersDB.model("users", usersSchema);
