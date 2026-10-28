const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  branch: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    default: "",
  },
  room: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Timetable", timetableSchema);
