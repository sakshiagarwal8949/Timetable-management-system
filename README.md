# 🎓 Timetable Management System (MERN Stack)

A comprehensive full-stack **MERN (MongoDB, Express, React, Node.js)** web application built for colleges and institutions to facilitate timetable scheduling, intelligent conflict prevention, and personalized role-based dashboards (Admin, Faculty, Student).

---

## 📁 Repository Architecture

```text
MERN_Project/
│
├── backend/                # Node.js + Express REST API Server
│   ├── middleware/         # JWT Auth & Role-based Access Control
│   ├── models/             # Mongoose Schemas (User, Timetable)
│   ├── .env                # Environment Configurations (Port, DB URI, JWT Secret)
│   ├── server.js           # Server entry point & API route handlers
│   ├── package.json        # Backend dependencies & scripts
│   └── readme.md           # Backend documentation
│
├── frontend/               # React 19 + Vite Client Application
│   ├── src/
│   │   ├── pages/          # Login, Dashboard, Timetable, Faculty & Student management
│   │   ├── components/     # Modular and reusable UI components
│   │   ├── App.jsx         # Route declarations
│   │   └── main.jsx        # Frontend entry point
│   ├── package.json        # Frontend dependencies & scripts
│   └── README.md           # Frontend documentation
│
└── README.md               # Main Project Overview & Setup Guide
```

---

## ⚙️ Commands Used to Build the Project (Creation Steps)

If you are recreating this project from scratch:

### 1. Backend Initialization:
```bash
# Create directory and navigate inside
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install backend dependencies
npm install express mongoose dotenv bcryptjs jsonwebtoken cors
cd ..
```

### 2. Frontend Initialization:
```bash
# Create Vite + React template
npm create vite@latest frontend -- --template react

# Navigate inside frontend directory
cd frontend

# Install dependencies and router
npm install
npm install react-router-dom
cd ..
```

---

## 🚀 How to Run the Full Project

To run both services locally, launch **two separate terminal instances**:

### Terminal 1: Start Backend Server
```bash
cd backend
npm install       # (First-time setup only)
npm start
```
> Server running at: **`http://localhost:3000`**

### Terminal 2: Start Frontend Application
```bash
cd frontend
npm install       # (First-time setup only)
npm run dev
```
> Application running at: **`http://localhost:5173`**

Open your web browser and navigate to **`http://localhost:5173`** to access the application.

---

## ✨ Key Features

- 🔐 **Role-Based Access Control (RBAC):** Tailored views and permissions for Admin, Faculty, and Students.
- ⚡ **Automated Conflict Detection:** Prevents simultaneous faculty assignments, classroom double-bookings, and section overlapping.
- 📅 **Schedule Validation:** Built-in safeguards against past-date booking and Sunday class schedules.
- 📊 **Dynamic Dashboards:** Real-time filtered schedule views according to the authenticated user's role.
- 🎨 **Modern Interface:** Responsive glassmorphic UI crafted with modern CSS and fast Vite development.

---

## 📖 Sub-module Documentation

For in-depth details on endpoints, schemas, and components:
- [Backend Documentation](file:///c:/Users/saksh/Documents/MERN_Project/backend/readme.md)
- [Frontend Documentation](file:///c:/Users/saksh/Documents/MERN_Project/frontend/README.md)
