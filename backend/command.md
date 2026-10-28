## Backend Setup

### 1. Create Backend Folder

```bash
mkdir backend
cd backend
```

### 2. Initialize Node.js Project

```bash
npm init -y
```

### 3. Install Express

```bash
npm install express
```

### 4. Install MongoDB and Environment Packages

```bash
npm install mongoose dotenv
```

### 5. Install Password Hashing Package

```bash
npm install bcryptjs
```

### 6. Install JWT Authentication Package

```bash
npm install jsonwebtoken
```

### 7. Start the Backend Server

```bash
npm start
```

The backend server runs on:

```text
http://localhost:3000
```

### Backend Packages Used

- Express – To create the REST API and server
- Mongoose – To connect Node.js with MongoDB
- Dotenv – To manage environment variables
- Bcryptjs – To hash and verify passwords
- Jsonwebtoken – To implement JWT authentication

### Backend API Endpoints

#### Home

```text
GET /
```

#### Timetable

```text
GET    /api/timetable
POST   /api/timetable
PUT    /api/timetable/:id
DELETE /api/timetable/:id
```

#### Authentication

```text
POST /api/register
POST /api/login
```

### Authentication

JWT authentication is used for protected routes.

The JWT token is sent using the Authorization header:

```text
Authorization: Bearer <token>
```

### User Roles

The system supports three roles:

```text
Admin
Faculty
Student
```

Admin can:

- Add timetable
- Update timetable
- Delete timetable

Faculty and Student can:

- View timetable
