const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["Admin", "Faculty", "Student"],
    required: true,
  },

  branch: {
    type: String,
    default: "",
  },

  section: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", userSchema);
