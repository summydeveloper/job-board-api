## 🚀 Job Board API

A role-based Job Board API built with **Node.js**, **Express**,**TypeScript** and **MongoDB**, supporting both **Employers** (who can post and manage jobs) and **Applicants** (who can browse job listings). Authenticated access with **JWT tokens**, and route protection based on user roles.

---

# 📅 Project Progress & Daily Tasks

### Day 1 & 2 — Project Setup + Authentication

Set up the project with user authentication and role-based access control using JWT

### Day 3 — Job Postings CRUD

Developed CRUD operations for job postings with employer-only modifications and public job viewing.

### Day 4 — Advanced Job Search & Pagination

Implemented advanced job filtering (by job type, location, salary range), pagination, and sorting for efficient data retrieval.

---

## 📁 Features

* 🔐 User registration and login (with JWT)
* 🧑‍💼 Employers can create, update, and delete jobs
* 🙋 Applicants can view job listings with advanced search options:

  * Filter by job type (Full-Time, Part-Time, Contract)
  * Filter by location (case-insensitive partial matches)
  * Filter by salary range (minSalary, maxSalary)
* 📄 Pagination and sorting (by date, salary, etc.) for scalable queries
* ✅ Role-based access control for secure endpoints
* 🧾 MongoDB for data storage
* 🧪 Fully testable with Postman or curl

---

## 🚀 Tech Stack

* Node.js + Express + TypeScript
* MongoDB + Mongoose
* JSON Web Tokens (JWT)
* dotenv
* Postman (for testing)

---

## 🧬 API Endpoints

### 👤 Auth Routes

| Method | Route                | Access | Description         |
| ------ | -------------------- | ------ | ------------------- |
| POST   | `/api/auth/register` | Public | Register user       |
| POST   | `/api/auth/login`    | Public | Login and get token |

### 💼 Job Routes

| Method | Route           | Access              | Description                                       |
| ------ | --------------- | ------------------- | ------------------------------------------------- |
| POST   | `/api/jobs`     | Employer only       | Create a new job posting                          |
| GET    | `/api/jobs`     | Public              | View jobs with filtering, pagination, and sorting |
| PUT    | `/api/jobs/:id` | Owner Employer only | Update a job you posted                           |
| DELETE | `/api/jobs/:id` | Owner Employer only | Delete a job you posted                           |

---

## 🛠️ Setup & Installation

```bash
# Clone the repo
git clone https://github.com/your-username/job-board-api.git
cd job-board-api

# Install dependencies
npm install

# Create a .env file and add:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Run the server
npm run dev
```

---

## 🧪 Testing

Use Postman or curl to test all endpoints:

* Register/Login to get a JWT token
* Use token in `Authorization` header as:
  `Bearer your_token_here`
* Test role-based access control for job routes
* Use query parameters on GET `/api/jobs` for advanced searching, e.g.:

  * `/api/jobs?jobType=Contract&page=2&limit=5`
  * `/api/jobs?location=Lagos&minSalary=50000&maxSalary=100000&sortBy=salary&order=desc`
  * `/api/jobs?jobType=Full-Time&location=Remote&sortBy=createdAt&order=desc`

---

## 👩‍💻 Author

**summydev**
[GitHub](https://github.com/summydeveloper) • [LinkedIn](https://linkedin.com/in/sumayahadegbite)

 
