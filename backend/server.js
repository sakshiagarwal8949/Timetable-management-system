const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Timetable = require("./models/Timetable");
const User = require("./models/User");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Home route
app.get("/", (req, res) => {
  res.send("Timetable Management System");
});

// Helper: validate timetable date
function validateDate(date, day) {
  if (!date || !day) return "Date and day are required.";

  const selectedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(selectedDate.getTime())) {
    return "Invalid date.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return "Past dates are not allowed.";
  }

  const actualDay = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  if (actualDay !== day) {
    return "Selected day does not match the date.";
  }

  if (actualDay === "Sunday") {
    return "Classes cannot be scheduled on Sunday.";
  }

  return null;
}

// Helper: check faculty, room, and branch+section conflicts
async function checkConflict(data, excludeId = null) {
  const query = {
    date: data.date,
    time: data.time,
    $or: [
      { facultyId: data.facultyId },
      { room: data.room },
      { branch: data.branch, section: data.section },
    ],
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Timetable.findOne(query);
}

// Helper: get detailed conflict reason
function getConflictMessage(conflict, data) {
  if (conflict.branch === data.branch && conflict.section === data.section) {
    return `Branch ${data.branch} (Section ${data.section}) already has a class scheduled at this date and time.`;
  }

  if (
    conflict.facultyId &&
    conflict.facultyId.toString() === data.facultyId.toString()
  ) {
    return "Selected faculty is already assigned to another class at this date and time.";
  }

  if (
    conflict.room &&
    conflict.room.trim().toLowerCase() === data.room.trim().toLowerCase()
  ) {
    return `Room "${data.room}" is already booked for another class at this date and time.`;
  }

  return "Schedule conflict: Faculty, Room, or Section is already booked for this date and time.";
}

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is missing in the .env file.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      role: user.role,
      name: user.name,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to login.",
      error: error.message,
    });
  }
});

// Public registration: Student only
app.post("/api/register", (req, res) => {
  return res.status(403).json({
    message: "Public registration is disabled. Please contact the Admin.",
  });
});

// Create Faculty: Admin only
app.post(
  "/api/faculty",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Name, email and password are required.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must contain at least 6 characters.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already registered.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const faculty = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "Faculty",
      });

      res.status(201).json({
        message: "Faculty account created successfully.",
        data: {
          id: faculty._id,
          name: faculty.name,
          email: faculty.email,
          role: faculty.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Unable to create faculty account.",
        error: error.message,
      });
    }
  },
);

// Get Faculty List: Admin only
app.get(
  "/api/faculty",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const faculty = await User.find(
        { role: "Faculty" },
        { name: 1, email: 1 },
      ).sort({ name: 1 });

      res.status(200).json(faculty);
    } catch (error) {
      res.status(500).json({
        message: "Unable to get faculty list.",
        error: error.message,
      });
    }
  },
);

// Create Student: Admin only
app.post(
  "/api/student",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { name, email, password, branch, section } = req.body;

      if (!name || !email || !password || !branch || !section) {
        return res.status(400).json({
          message: "All fields including branch and section are required.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must contain at least 6 characters.",
        });
      }

      const validBranches = ["CSE", "IT", "ECE", "ME", "CE"];
      const validSections = ["A", "B", "C", "D"];

      if (!validBranches.includes(branch)) {
        return res.status(400).json({
          message: "Invalid branch selected.",
        });
      }

      if (!validSections.includes(section)) {
        return res.status(400).json({
          message: "Invalid section selected.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already registered.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const student = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "Student",
        branch,
        section,
      });

      res.status(201).json({
        message: "Student account created successfully.",
        data: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: student.role,
          branch: student.branch,
          section: student.section,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Unable to create student account.",
        error: error.message,
      });
    }
  },
);

// Get Timetable
app.get("/api/timetable", authMiddleware, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "Faculty") {
      query = { facultyId: req.user.id };
    } else if (req.user.role === "Student") {
      const student = await User.findById(req.user.id);

      if (!student) {
        return res.status(404).json({
          message: "Student account not found.",
        });
      }

      query = {
        branch: student.branch,
        section: student.section,
      };
    }

    const timetable = await Timetable.find(query).sort({
      date: 1,
    });

    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({
      message: "Unable to get timetable.",
      error: error.message,
    });
  }
});

// Add Timetable: Admin only
app.post(
  "/api/timetable",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { date, day, time, subject, facultyId, branch, section, room } =
        req.body;

      if (
        !date ||
        !day ||
        !time ||
        !subject ||
        !facultyId ||
        !branch ||
        !section ||
        !room
      ) {
        return res.status(400).json({
          message: "Please fill in all timetable fields.",
        });
      }

      const dateError = validateDate(date, day);

      if (dateError) {
        return res.status(400).json({
          message: dateError,
        });
      }

      const selectedFaculty = await User.findOne({
        _id: facultyId,
        role: "Faculty",
      });

      if (!selectedFaculty) {
        return res.status(400).json({
          message: "Selected faculty was not found.",
        });
      }

      const timetableData = {
        date,
        day,
        time: time.trim(),
        subject: subject.trim(),
        faculty: selectedFaculty.name,
        facultyId: selectedFaculty._id,
        branch,
        section,
        room: room.trim(),
      };

      const conflict = await checkConflict(timetableData);

      if (conflict) {
        return res.status(409).json({
          message: getConflictMessage(conflict, timetableData),
        });
      }

      const newTimetable = await Timetable.create(timetableData);

      res.status(201).json({
        message: "Timetable added successfully.",
        data: newTimetable,
      });
    } catch (error) {
      res.status(500).json({
        message: "Unable to add timetable.",
        error: error.message,
      });
    }
  },
);

// Update Timetable: Admin only
app.put(
  "/api/timetable/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { date, day, time, subject, facultyId, branch, section, room } =
        req.body;

      if (
        !date ||
        !day ||
        !time ||
        !subject ||
        !facultyId ||
        !branch ||
        !section ||
        !room
      ) {
        return res.status(400).json({
          message: "Please fill in all timetable fields.",
        });
      }

      const dateError = validateDate(date, day);

      if (dateError) {
        return res.status(400).json({
          message: dateError,
        });
      }

      const selectedFaculty = await User.findOne({
        _id: facultyId,
        role: "Faculty",
      });

      if (!selectedFaculty) {
        return res.status(400).json({
          message: "Selected faculty was not found.",
        });
      }

      const timetableData = {
        date,
        day,
        time: time.trim(),
        subject: subject.trim(),
        faculty: selectedFaculty.name,
        facultyId: selectedFaculty._id,
        branch,
        section,
        room: room.trim(),
      };

      const conflict = await checkConflict(timetableData, req.params.id);

      if (conflict) {
        return res.status(409).json({
          message: getConflictMessage(conflict, timetableData),
        });
      }

      const updatedTimetable = await Timetable.findByIdAndUpdate(
        req.params.id,
        timetableData,
        { new: true, runValidators: true },
      );

      if (!updatedTimetable) {
        return res.status(404).json({
          message: "Timetable record not found.",
        });
      }

      res.status(200).json({
        message: "Timetable updated successfully.",
        data: updatedTimetable,
      });
    } catch (error) {
      res.status(500).json({
        message: "Unable to update timetable.",
        error: error.message,
      });
    }
  },
);

// Delete Timetable: Admin only
app.delete(
  "/api/timetable/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const deletedTimetable = await Timetable.findByIdAndDelete(req.params.id);

      if (!deletedTimetable) {
        return res.status(404).json({
          message: "Timetable record not found.",
        });
      }

      res.status(200).json({
        message: "Timetable deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        message: "Unable to delete timetable.",
        error: error.message,
      });
    }
  },
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
