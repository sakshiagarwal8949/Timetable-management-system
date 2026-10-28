# 🎓 Timetable Management System (MERN Stack)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://timetable-management-system-three.vercel.app/login)
[![API Server](https://img.shields.io/badge/API_Server-Render-46E3B7?style=for-the-badge&logo=render)](https://timetable-management-system-x4qr.onrender.com)
[![React](https://img.shields.io/badge/React_19-Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)

A comprehensive full-stack **MERN (MongoDB, Express, React, Node.js)** web application built for colleges and institutions to facilitate timetable scheduling, intelligent conflict prevention, and personalized role-based dashboards (Admin, Faculty, Student).

---

## 🌐 Live Demo & Credentials

- 🔗 **Live Application (Frontend):** [https://timetable-management-system-three.vercel.app/login](https://timetable-management-system-three.vercel.app/login)
- ⚙️ **REST API Server (Backend):** [https://timetable-management-system-x4qr.onrender.com](https://timetable-management-system-x4qr.onrender.com)

### 🔑 Demo Accounts for Testing:
| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@gmail.com` | `admin` | Full control: create timetables, provision faculties & students, detect conflicts |
| **👨‍🏫 Faculty** | `faculty@gmail.com` | `faculty123` | View assigned lectures, schedule details, classroom numbers |
| **🎓 Student** | `sakshi@gmail.com` | `sakshi123` | View personal section timetable, faculty assignments & timings |

*(The login page also provides one-click quick demo login buttons!)*


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

---

## 🌐 Deployment Guide (GitHub + Render + Vercel)

### Step 1: Push Code to GitHub
```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Deploy Backend on Render (Free)
1. Go to [render.com](https://render.com) and create an account.
2. Click **New +** -> **Web Service** -> Connect your GitHub repo.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_jwt_secret`
   - `PORT`: `3000`
5. Click **Deploy Web Service** and copy your backend URL (e.g., `https://timetable-api.onrender.com`).

### Step 3: Deploy Frontend on Vercel (Free)
1. Go to [vercel.com](https://vercel.com) and connect your GitHub account.
2. Click **Add New...** -> **Project** -> Select your repo.
3. In configure project settings:
   - **Root Directory**: Click edit and select `frontend`
   - **Framework Preset**: `Vite`
4. Add **Environment Variable**:
   - `VITE_API_URL`: `https://timetable-api.onrender.com` (Your Render backend URL without trailing slash)
5. Click **Deploy**. Your app is live!

