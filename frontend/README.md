# 💻 Timetable Management System - Frontend

This is the **Frontend Web Application** for the Timetable Management System, developed with **React 19 and Vite**. It features an interactive UI, glassmorphic design, dynamic timetable filtering, and role-based route protection.

---

## 🛠️ Tech Stack & Dependencies

- **Build Tool & Bundler:** [Vite](https://vitejs.dev/)
- **UI Library:** [React 19](https://react.dev/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **Styling:** Custom Responsive CSS (Glassmorphism, animations, responsive flex/grid layouts)
- **Linter:** [Oxlint](https://oxc.rs/)

---

## ⚙️ Commands Used to Build the Frontend (Creation Steps)

If you are setting up or creating this frontend from scratch, here are the commands executed:

```bash
# 1. Create a Vite React application
npm create vite@latest frontend -- --template react

# 2. Navigate to the frontend directory
cd frontend

# 3. Install core dependencies
npm install

# 4. Install React Router for multi-page routing
npm install react-router-dom
```

---

## 🚀 How to Run the Frontend Locally

### Step 1: Open terminal in the frontend directory
```bash
cd frontend
```

### Step 2: Install dependencies (first-time setup only)
```bash
npm install
```

### Step 3: Start the local development server
```bash
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:5173`**

*(Note: Ensure the backend API server is running on `http://localhost:3000`)*

---

## 📄 Pages & Application Routes

| Page | Route | Access | Purpose |
|---|---|---|---|
| **Login** | `/login` | Public | Authentication portal for Admin, Faculty, and Students |
| **Register** | `/register` | Public | Registration notice / redirect to login (managed by Admin) |
| **Dashboard** | `/dashboard` | Protected (All Roles) | Role-specific personalized view of schedules |
| **Manage Timetable** | `/manage-timetable` | Protected (Admin) | Add, edit, check conflicts, and delete class schedules |
| **Create Faculty** | `/create-faculty` | Protected (Admin) | Portal to register new faculty members |
| **Create Student** | `/create-student` | Protected (Admin) | Portal to register students with Branch & Section details |

---

## 🔐 Authentication & Route Protection

- **`ProtectedRoute.jsx`**: Intercepts unauthenticated users and redirects them to `/login`.
- **Session Storage**: JWT tokens and role information received upon login are safely stored in `localStorage`.
- **Logout Flow**: Clears local session and credentials, redirecting back to the login page.

---

## 📦 Production Build (Optional)

To build and preview the application for production deployment:

```bash
# Generate production bundle in dist/
npm run build

# Preview the production build locally
npm run preview
```
