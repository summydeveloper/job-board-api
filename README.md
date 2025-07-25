## 🚀 Job Board API

A role-based Job Board API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**, supporting both **Employers** (who can post and manage jobs) and **Applicants** (who can browse listings, apply, and track their status). Authenticated access with **JWT tokens**, and route protection based on user roles.

---

# 📅 Project Progress & Daily Tasks

### Day 1 & 2 — Project Setup + Authentication

Set up the project with user authentication and role-based access control using JWT.

### Day 3 — Job Postings CRUD

Developed CRUD operations for job postings with employer-only modifications and public job viewing.

### Day 4 — Advanced Job Search & Pagination

Implemented advanced job filtering (by job type, location, salary range), pagination, and sorting for efficient data retrieval.

### Day 5 — Job Applications with Secure File Uploads

Built the Application model (`applicantId`, `jobId`, `resumePath`, etc.) for handling job applications. Implemented applicant-side file uploads, duplicate prevention, and secure storage.

### 🎯 Day 6 — Application Tracking Features

Implemented role-based application tracking: employers can view applicants for their jobs, and applicants can view their own submissions, with strict access control and clean JSON responses.

---

## 📁 Features

* 🔐 User registration and login (with JWT)
* 🧑‍💼 Employers can create, update, and delete jobs
* 🙋 Applicants can:

  * Browse jobs with filters (type, location, salary)
  * Submit resumes and cover letters when applying
  * View all their submitted applications and track statuses
* 📄 Employers can view all applicants for their posted jobs
* 📄 Pagination and sorting for job listings
* 🧪 Role-based access control for all secured routes
* 🧾 MongoDB for data persistence
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
| POST   | `/api/auth/register` | Public | Register new user   |
| POST   | `/api/auth/login`    | Public | Login and get token |

### 💼 Job Routes

| Method | Route           | Access              | Description                                       |
| ------ | --------------- | ------------------- | ------------------------------------------------- |
| POST   | `/api/jobs`     | Employer only       | Create a new job posting                          |
| GET    | `/api/jobs`     | Public              | View jobs with filtering, pagination, and sorting |
| PUT    | `/api/jobs/:id` | Owner Employer only | Update a job you posted                           |
| DELETE | `/api/jobs/:id` | Owner Employer only | Delete a job you posted                           |

### 📄 Application Routes

| Method | Route                               | Access         | Description                                            |
| ------ | ----------------------------------- | -------------- | ------------------------------------------------------ |
| POST   | `/api/applications/apply/:jobId`    | Applicant only | Apply for a job (attach resume, optional cover letter) |
| GET    | `/api/jobs/:jobId/applications`     | Employer only  | View all applicants for one of your posted jobs        |
| GET    | `/api/applications/my-applications` | Applicant only | View all your submitted applications and their status  |

---

## 🛠️ Setup & Installation

```bash
git clone https://github.com/your-username/job-board-api.git
cd job-board-api
npm install

# Set up your environment variables
echo "PORT=5000\nMONGO_URI=your_mongodb_connection_string\nJWT_SECRET=your_secret_key" > .env

npm run dev
```

---

## 🧪 Testing

* Get a JWT token by registering and logging in
* Include token as `Authorization: Bearer <token>` in request headers
* Test employer-only routes (`/api/jobs`, `/api/jobs/:jobId/applications`)
* Test applicant-only routes (`/api/applications/my-applications`)
* Attach resume files as `form-data` for the application route
* Experiment with filtering and sorting on `/api/jobs`

---

## 👩‍💻 Author

**summydev**
[GitHub](https://github.com/summydeveloper) • [LinkedIn](https://linkedin.com/in/sumayahadegbite)

 