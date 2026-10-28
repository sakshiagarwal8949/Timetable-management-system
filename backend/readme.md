# 📚 Timetable Management System - Backend API

This is the **Backend REST API Server** for the Timetable Management System, built using **Node.js, Express, and MongoDB**. It features secure JWT authentication, Role-Based Access Control (Admin, Faculty, Student), and intelligent conflict detection for scheduling.

---

## 🛠️ Tech Stack & Dependencies

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication & Security:** 
  - `jsonwebtoken` (JWT for stateless token auth)
  - `bcryptjs` (Password hashing)
- **Utilities:** 
  - `dotenv` (Environment variables management)
  - `cors` (Cross-Origin Resource Sharing)

---

## ⚙️ Commands Used to Build the Backend (Creation Steps)

If you are setting up or creating this backend from scratch, here are the commands executed:

```bash
# 1. Create and navigate into the backend folder
mkdir backend
cd backend

# 2. Initialize a Node.js project (creates package.json)
npm init -y

# 3. Install required packages and dependencies
npm install express mongoose dotenv bcryptjs jsonwebtoken cors
```

---

## 🔑 Environment Variables Setup (`.env`)

Create a `.env` file inside the `backend` folder and add the following configuration:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

> **Note:** Replace `your_mongodb_connection_string` with your MongoDB Atlas or local MongoDB URI, and set a secure string for `JWT_SECRET`.

---

## 🚀 How to Run the Backend Server

### Step 1: Open terminal in the backend directory
```bash
cd backend
```

### Step 2: Install dependencies (first-time setup only)
```bash
npm install
```

### Step 3: Start the server
```bash
npm start
```

Upon successful connection, the terminal will display:
```text
MongoDB connected successfully.
Server running on port 3000
```
API Base URL: **`http://localhost:3000`**

---

## 📡 API Endpoints Reference

### 1. Home / Health Check
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Welcome message & health check |

### 2. Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/login` | Public | Authenticates user and returns JWT token & role |
| `POST` | `/api/register` | Public (Disabled) | Public sign-up disabled (Admin manages accounts) |

### 3. Faculty Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/faculty` | Admin Only | Register a new faculty account |
| `GET` | `/api/faculty` | Admin Only | Fetch all registered faculty members |

### 4. Student Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/student` | Admin Only | Register a student with branch and section details |

### 5. Timetable Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/timetable` | Protected | Fetch timetable (automatically filtered by user role) |
| `POST` | `/api/timetable` | Admin Only | Create a new class schedule (with conflict checks) |
| `PUT` | `/api/timetable/:id` | Admin Only | Update an existing class schedule |
| `DELETE` | `/api/timetable/:id` | Admin Only | Delete a class schedule |

---

## 🛡️ Smart Conflict Detection Features

When creating or modifying schedules, the backend validates against potential clashes:
1. **Faculty Conflict:** Prevents assigning the same faculty to multiple classes at the same date and time.
2. **Room Conflict:** Ensures no classroom or lab is double-booked for the same time slot.
3. **Branch & Section Conflict:** Prevents scheduling overlapping classes for the same branch and section.
4. **Date & Day Validation:** Disallows scheduling on Sundays and restricts booking for past dates.

---

## 👥 User Roles & Permissions

- **Admin:** Full control. Can create faculty/student credentials, and add, edit, or delete any timetable schedule.
- **Faculty:** Can view only their assigned class schedules.
- **Student:** Can view schedules relevant to their specific branch and section.
