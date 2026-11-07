# Student Management System (SMS)
A full-stack enterprise-grade Student Management System built using the **MERN Stack** (MongoDB, Express.js, React, Node.js) with JWT authentication and strict Role-Based Access Control (RBAC).

---

## 📌 Features & Functional Requirements

### 1. User Authentication
* **Registration & Login:** Register and authenticate users using email and password.
* **Password Hashing:** Passwords encrypted using `bcryptjs` with salt rounds.
* **JWT Token Authorization:** Generates secure JWT tokens upon login with configurable expiration.
* **Auth Middleware:** Verifies tokens on protected endpoints, attaching verified user identity to the request.

### 2. Student Management (CRUD)
* **Add Student:** Create records containing `name`, `email`, `age`, `marks`, `city`, `department`, `roll`, `phone`.
* **Retrieve Students:** View list of all students with query filters and pagination.
* **Retrieve Details:** Fetch comprehensive student profile by MongoDB `_id`.
* **Update Student:** Edit existing student information with validation and duplicate checks.
* **Delete Student:** Permanently delete a student record.

### 3. Search and Filtering
* **By City or Department:** Case-insensitive search/filter (e.g., `?city=Mumbai&department=Computer Science`).
* **Marks Threshold:** Retrieve students with marks greater than a specified threshold (e.g., `?marksGreaterThan=75`).
* **Age Range:** Filter within age bounds (e.g., `?minAge=20&maxAge=23`).
* **Sorting by Marks:** Sort in ascending or descending order (e.g., `?sortBy=marks&order=desc`).
* **Full-Text Keyword Search:** Search by name, email, roll, city, or department.

### 4. Role-Based Access Control (RBAC)
* **Admin:** Full privileges — create, read, update, and delete student records.
* **Student:** Read-only access — can browse and inspect student records; restricted from create, update, or delete operations (returns HTTP 403 Forbidden).

### 5. Pagination (Challenge Requirement)
* Server-side pagination using `page` and `limit` query parameters.
* Returns structured metadata:
  ```json
  {
    "success": true,
    "count": 10,
    "totalStudents": 12,
    "totalPages": 2,
    "currentPage": 1,
    "limit": 10,
    "data": [...]
  }
  ```

---

## 🏗️ Architecture & Project Structure

```
SMS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection logic
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, Login, Me handlers
│   │   │   └── studentController.js# Student CRUD, filters, sort, pagination
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification & RBAC authorization
│   │   │   └── error.js            # Centralized error handler & 404 catcher
│   │   ├── models/
│   │   │   ├── User.js             # User Mongoose schema & bcrypt hooks
│   │   │   └── Student.js          # Student Mongoose schema & indexes
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # Auth endpoints
│   │   │   └── studentRoutes.js    # Student endpoints
│   │   ├── utils/
│   │   │   ├── jwt.js              # Token generator & verifier
│   │   │   └── seed.js             # Database seeder script
│   │   ├── app.js                  # Express app setup & middleware
│   │   └── server.js               # Server bootstrap & graceful shutdown
│   ├── tests/
│   │   ├── auth.test.js            # 8 automated auth test suites
│   │   └── student.test.js         # 19 automated student & RBAC test suites
│   ├── .env                        # Environment configurations
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx       # Sign In, Register, Quick RBAC Switch
│   │   │   ├── DeleteModal.jsx     # Delete confirmation dialog
│   │   │   ├── FilterBar.jsx       # Search, City, Dept, Marks, Age, Sort
│   │   │   ├── Navbar.jsx          # Top header & role simulator
│   │   │   ├── Pagination.jsx      # Page numbers & rows per page selector
│   │   │   ├── Sidebar.jsx         # School management left navigation
│   │   │   ├── StudentModal.jsx    # Add & Edit modal with validation
│   │   │   ├── StudentDetailModal.jsx # Full student profile view
│   │   │   ├── StudentTable.jsx    # Data table matching reference UI
│   │   │   └── Toast.jsx           # Notification toast
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication state
│   │   ├── services/
│   │   │   └── api.js              # Fetch client with Bearer token injection
│   │   ├── App.jsx                 # Main application dashboard
│   │   └── main.jsx
│   ├── vite.config.js              # Vite config with backend proxy
│   └── package.json
└── package.json                    # Monorepo root scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24)
- **MongoDB**: running locally on port `27017` or configured via `MONGODB_URI` in `backend/.env`.

### 2. Seed Initial Database
Seed default Admin (`admin@sms.com` / `password123`) and Student (`student@sms.com` / `password123`) accounts, along with 12 sample student records:
```bash
npm run seed
```

### 3. Run Automated Tests
Execute the comprehensive test suite (27 passing tests covering all requirements):
```bash
npm run test
```

### 4. Start the Application
In separate terminal tabs:

**Terminal 1 — Backend API (Port 5000):**
```bash
npm run dev:backend
```

**Terminal 2 — React Frontend (Port 3000):**
```bash
npm run dev:frontend
```

Open your browser at **`http://localhost:3000`**.

---

## 🔑 Default Credentials for Evaluation

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@sms.com` | `password123` | Full Access: Create, Read, Update, Delete students |
| **Student** | `student@sms.com` | `password123` | Read-Only: Can view all students and details |

> **Pro Tip:** In the frontend navbar, use the **Role Simulator** button to instantly switch between Admin and Student sessions to test RBAC live!

---

## 📡 API Reference & Endpoints

### Authentication Endpoints

#### 1. Register User
`POST /api/auth/register`
```json
{
  "name": "Alex Miller",
  "email": "alex@sms.com",
  "password": "password123",
  "role": "student" // "admin" or "student"
}
```

#### 2. Log In
`POST /api/auth/login`
```json
{
  "email": "admin@sms.com",
  "password": "password123"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "672c...",
    "name": "System Administrator",
    "email": "admin@sms.com",
    "role": "admin"
  }
}
```

#### 3. Current User Profile
`GET /api/auth/me`
* **Header:** `Authorization: Bearer <token>`

---

### Student Endpoints (Protected by JWT)

#### 1. Add Student (Admin Only)
`POST /api/students`
* **Header:** `Authorization: Bearer <token>`
```json
{
  "name": "Arman Khan",
  "email": "arman.khan@sms.edu",
  "age": 20,
  "marks": 88,
  "city": "Mumbai",
  "department": "Computer Science",
  "roll": "CS-101",
  "phone": "+91 9876543210"
}
```

#### 2. Get All Students (Admin & Student)
`GET /api/students`
* **Header:** `Authorization: Bearer <token>`
* **Supported Query Parameters:**
  * `search` : Keyword match across name, email, roll, city, department
  * `city` : Filter by city name (e.g. `city=Mumbai`)
  * `department` : Filter by department (e.g. `department=Computer Science`)
  * `marksGreaterThan` : Retrieve students where marks > value (e.g. `marksGreaterThan=75`)
  * `minAge` & `maxAge` : Filter within age bounds (e.g. `minAge=20&maxAge=23`)
  * `sortBy=marks&order=desc|asc` : Sort by marks descending or ascending
  * `page` & `limit` : Pagination controls (default: `page=1&limit=10`)

**Example Request:**
```
GET /api/students?department=Computer Science&marksGreaterThan=80&sortBy=marks&order=desc&page=1&limit=5
```

#### 3. Get Student by ID (Admin & Student)
`GET /api/students/:id`
* **Header:** `Authorization: Bearer <token>`

#### 4. Update Student (Admin Only)
`PUT /api/students/:id`
* **Header:** `Authorization: Bearer <token>`
```json
{
  "marks": 95,
  "city": "Pune"
}
```

#### 5. Delete Student (Admin Only)
`DELETE /api/students/:id`
* **Header:** `Authorization: Bearer <token>`
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Student record deleted successfully",
  "id": "672c..."
}
```

---

## 🧪 Test Suite Summary

Total Test Suites: **2**  
Total Tests Passed: **27 / 27 (100%)**

- `tests/auth.test.js`:
  - Default student registration
  - Admin registration with role parameter
  - Duplicate email rejection (409 Conflict)
  - Missing field validation (400 Bad Request)
  - Successful login with token issuance
  - Incorrect password rejection (401 Unauthorized)
  - Non-existent user rejection (401 Unauthorized)
- `tests/student.test.js`:
  - Unauthenticated access rejection (401)
  - Student role forbidden from creating student (403 RBAC)
  - Admin successfully creating student (201)
  - Duplicate student email rejection (409)
  - Student role allowed to read records (200)
  - City filtering
  - Department filtering
  - Marks greater than threshold query
  - Age range query (`minAge` & `maxAge`)
  - Sort by marks descending
  - Sort by marks ascending
  - Pagination with `page` and `limit`
  - Retrieve by ID
  - 404 on non-existent ID
  - Student role forbidden from updating student (403 RBAC)
  - Admin successfully updating student (200)
  - Student role forbidden from deleting student (403 RBAC)
  - Admin successfully deleting student (200)
