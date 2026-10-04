# JobPilot Backend 🚀

**JobPilot** is an AI-powered Job Application Assistant backend designed to help users manage the complete job application process from resume preparation to application tracking.

The backend provides authentication, resume and job management, resume/job parsing, job-match analysis, tailored resume generation, cover letter generation, interview preparation, application tracking, and dashboard analytics through a RESTful API.

🌐 **Live API:**
https://job-pilot-server-lovat.vercel.app

📚 **API Documentation:**
https://job-pilot-server-lovat.vercel.app/api-docs/

❤️ **Built by:** Parvez Rahman

---

## ✨ Features

### 🔐 Authentication

- User registration
- Email OTP verification
- JWT-based authentication
- Refresh token authentication
- Logout
- Forgot password with email OTP
- Password reset
- Secure password hashing with bcrypt

### 📄 Resume Management

- Upload resume PDF
- Extract text from PDF
- Store parsed resume information
- Create, update, retrieve, and delete resumes
- User-specific resume ownership

### 💼 Job Management

- Create job descriptions
- Update and delete jobs
- Store company and job information
- Parse job descriptions
- User-specific job ownership

### 📊 Resume vs Job Analysis

- Calculate resume/job match score
- Identify matched skills
- Identify missing skills
- Detect experience gaps
- Extract important keywords
- Generate recommendations

### 🎯 Tailored Resume

- Generate a job-specific resume
- Reorder relevant skills
- Prioritize relevant experience
- Prioritize relevant projects
- Generate a tailored professional summary

### ✉️ Cover Letter

- Generate cover letters locally from resume and job data
- Professional, confident, and enthusiastic tones
- Short, medium, and long formats
- Update and delete generated cover letters

### 🎤 Interview Preparation

- Generate technical interview questions
- Generate behavioral questions
- Generate situational questions
- Generate questions from job skills and responsibilities
- Store interview sessions

### 📋 Application Tracker

- Save job applications
- Track application status
- Add application notes
- Track application dates
- Filter applications by status

Supported statuses:

```text
SAVED
APPLIED
INTERVIEW
OFFER
REJECTED
WITHDRAWN
```

### 📈 Dashboard

- Total resumes
- Total jobs
- Total applications
- Total cover letters
- Total interviews
- Total analyses
- Average match score
- Application status statistics

---

# 🏗️ Architecture

```text
                        JobPilot Backend
                              │
                              ▼
                         REST API
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
        Authentication      Resume             Job
            │                 │                 │
            │              Parsing           Parsing
            │                 │                 │
            └─────────────────┼─────────────────┘
                              │
                              ▼
                         Job Analysis
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
        Tailored Resume   Cover Letter    Interview Prep
              │               │                │
              └───────────────┼────────────────┘
                              │
                              ▼
                     Application Tracker
                              │
                              ▼
                         Dashboard
```

---

# 🛠️ Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- JWT
- bcrypt
- Nodemailer
- Multer
- PDF parsing
- Swagger / OpenAPI

## AI / Processing

- Gemini integration where AI generation/parsing is used
- Local deterministic processing for analysis and other features
- Zod-based structured data validation

## Deployment

- Vercel
- PostgreSQL

---

# 📁 Project Structure

```text
src/
├── app/
│   ├── middlewares/
│   ├── modules/
│   │   ├── ai/
│   │   ├── analysis/
│   │   ├── application/
│   │   ├── auth/
│   │   ├── cover-letter/
│   │   ├── dashboard/
│   │   ├── interview/
│   │   ├── job/
│   │   ├── resume/
│   │   └── tailored-resume/
│   │
│   └── routes/
│
├── config/
├── errors/
├── helpers/
├── lib/
├── docs/
├── types/
├── app.ts
└── server.ts

prisma/
└── schema.prisma
```

---

# 🔑 API Base URL

```text
https://job-pilot-server-lovat.vercel.app/api/v1
```

---

# 📚 API Endpoints

## 🔐 Authentication

| Method | Endpoint                | Description                                    | Auth |
| ------ | ----------------------- | ---------------------------------------------- | ---- |
| POST   | `/auth/sign-up`         | Register a new user and send verification code | No   |
| POST   | `/auth/verify-signup`   | Verify signup using email OTP                  | No   |
| POST   | `/auth/sign-in`         | Sign in to JobPilot                            | No   |
| POST   | `/auth/forgot-password` | Send password reset OTP                        | No   |
| POST   | `/auth/verify-code`     | Verify password reset OTP                      | No   |
| POST   | `/auth/reset-password`  | Set a new password                             | No   |

### Signup Flow

```text
POST /auth/signup
        ↓
Verification code sent to email
        ↓
POST /auth/verify-signup
        ↓
Account created
        ↓
Access token returned
```

### Password Reset Flow

```text
POST /auth/forgot-password
        ↓
OTP sent to email
        ↓
POST /auth/verify-password-reset
        ↓
Temporary reset token
        ↓
POST /auth/reset-password
        ↓
Password updated
```

---

# 📄 Resume API

| Method | Endpoint                | Description            | Auth |
| ------ | ----------------------- | ---------------------- | ---- |
| POST   | `/resume/create-resume` | Upload/create a resume | JWT  |
| GET    | `/resume`               | Get all user resumes   | JWT  |
| GET    | `/resume/:id`           | Get a specific resume  | JWT  |
| PATCH  | `/resume/:id`           | Update resume          | JWT  |
| DELETE | `/resume/:id`           | Delete resume          | JWT  |

---

# 💼 Job API

| Method | Endpoint          | Description        | Auth |
| ------ | ----------------- | ------------------ | ---- |
| POST   | `/job/create-job` | Create a job       | JWT  |
| GET    | `/job`            | Get all jobs       | JWT  |
| GET    | `/job/:id`        | Get a specific job | JWT  |
| PATCH  | `/job/:id`        | Update job         | JWT  |
| DELETE | `/job/:id`        | Delete job         | JWT  |

---

# 🤖 AI API

The AI module handles resume and job parsing.

| Method | Endpoint                     | Description              | Auth |
| ------ | ---------------------------- | ------------------------ | ---- |
| POST   | `/ai/resume/:resumeId/parse` | Parse resume information | JWT  |
| POST   | `/ai/jobs/:jobId/parse`      | Parse job information    | JWT  |

> Adjust these two paths if your current `ai.route.ts` uses different route names.

---

# 📊 Analysis API

| Method | Endpoint                    | Description                  | Auth |
| ------ | --------------------------- | ---------------------------- | ---- |
| POST   | `/analysis/create-analysis` | Analyze resume against a job | JWT  |

The analysis response can contain:

```text
Match Score
Matched Skills
Missing Skills
Experience Gaps
Keywords
Recommendations
```

---

# 🎯 Tailored Resume API

| Method | Endpoint                  | Description                | Auth |
| ------ | ------------------------- | -------------------------- | ---- |
| POST   | `/tailored-resume/create` | Generate a tailored resume | JWT  |

Required information:

```json
{
  "resumeId": "resume_id",
  "jobId": "job_id",
  "analysisId": "analysis_id"
}
```

---

# ✉️ Cover Letter API

| Method | Endpoint               | Description            | Auth |
| ------ | ---------------------- | ---------------------- | ---- |
| POST   | `/cover-letter/create` | Generate cover letter  | JWT  |
| GET    | `/cover-letter`        | Get user cover letters | JWT  |
| GET    | `/cover-letter/:id`    | Get a cover letter     | JWT  |
| PATCH  | `/cover-letter/:id`    | Update cover letter    | JWT  |
| DELETE | `/cover-letter/:id`    | Delete cover letter    | JWT  |

Example:

```json
{
  "resumeId": "resume_id",
  "jobId": "job_id",
  "tone": "professional",
  "length": "medium"
}
```

Supported tones:

```text
professional
confident
enthusiastic
```

Supported lengths:

```text
short
medium
long
```

---

# 🎤 Interview API

| Method | Endpoint            | Description              | Auth |
| ------ | ------------------- | ------------------------ | ---- |
| POST   | `/interview/create` | Create interview session | JWT  |
| GET    | `/interview`        | Get interview sessions   | JWT  |
| GET    | `/interview/:id`    | Get interview session    | JWT  |
| PATCH  | `/interview/:id`    | Update interview session | JWT  |
| DELETE | `/interview/:id`    | Delete interview session | JWT  |

Interview questions are generated using job skills and responsibilities.

---

# 📋 Application Tracker API

| Method | Endpoint              | Description              | Auth |
| ------ | --------------------- | ------------------------ | ---- |
| POST   | `/application/create` | Create application       | JWT  |
| GET    | `/application`        | Get applications         | JWT  |
| GET    | `/application/:id`    | Get specific application | JWT  |
| PATCH  | `/application/:id`    | Update application       | JWT  |
| DELETE | `/application/:id`    | Delete application       | JWT  |

Application statuses:

```text
SAVED
APPLIED
INTERVIEW
OFFER
REJECTED
WITHDRAWN
```

Example:

```json
{
  "jobId": "job_id",
  "status": "APPLIED",
  "notes": "Applied through company website"
}
```

---

# 📈 Dashboard API

| Method | Endpoint     | Description              | Auth |
| ------ | ------------ | ------------------------ | ---- |
| GET    | `/dashboard` | Get dashboard statistics | JWT  |

Example response:

```json
{
  "totalResumes": 3,
  "totalJobs": 15,
  "totalApplications": 10,
  "totalCoverLetters": 7,
  "totalInterviews": 5,
  "totalAnalyses": 12,
  "averageMatchScore": 76.42,
  "applicationStats": {
    "saved": 2,
    "applied": 4,
    "interview": 2,
    "offer": 1,
    "rejected": 1,
    "withdrawn": 0
  }
}
```

---

# ❤️ Health Check

```http
GET /api/v1/health
```

Response:

```json
{
  "success": true,
  "message": "JobPilot API is running"
}
```

---

# 📖 Swagger API Documentation

Interactive API documentation:

```text
https://job-pilot-server-lovat.vercel.app/api-docs/
```

Swagger/OpenAPI provides interactive documentation for the JobPilot REST API.

---

# 🔐 Authentication

Protected endpoints require a JWT access token.

Send the token using:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Example:

```http
GET /api/v1/dashboard
Authorization: Bearer eyJhbGciOi...
```

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
NODE_ENV=development

PORT=5000

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUND=12

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

API_BASE_URL=http://localhost:5000/api/v1
FRONTEND_URL=http://localhost:3000
```

Never commit your `.env` file.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd JobPilot-backend
```

## 2. Install dependencies

```bash
yarn install
```

## 3. Configure environment variables

Create:

```text
.env
```

and add the required environment variables.

## 4. Generate Prisma Client

```bash
yarn prisma generate
```

## 5. Run database migrations

Development:

```bash
yarn prisma migrate dev
```

Production:

```bash
yarn prisma migrate deploy
```

## 6. Start development server

```bash
yarn dev
```

The API will run on:

```text
http://localhost:5000
```

## 7. Build the project

```bash
yarn build
```

## 8. Start production build

```bash
yarn start
```

---

# 🧪 API Testing

The API can be tested using:

- Postman
- Swagger UI
- REST Client
- Frontend application

Swagger:

```text
https://job-pilot-server-lovat.vercel.app/api-docs/
```

---

# 🗄️ Database

JobPilot uses:

```text
PostgreSQL
       ↓
Prisma ORM
```

Main entities include:

```text
User
Session
Resume
ResumeVersion
Job
JobAnalysis
CoverLetter
InterviewSession
Application
PendingSignup
PasswordReset
```

---

# 🚀 Deployment

The backend is deployed on:

**Vercel**

Production API:

```text
https://job-pilot-server-lovat.vercel.app
```

API Base URL:

```text
https://job-pilot-server-lovat.vercel.app/api/v1
```

Swagger:

```text
https://job-pilot-server-lovat.vercel.app/api-docs/
```

---

# 🎯 Project Goals

JobPilot is designed to reduce the time and effort required to apply for jobs by bringing multiple job-search tools into one platform:

```text
Resume
  ↓
Job Description
  ↓
Resume/JD Analysis
  ↓
Tailored Resume
  ↓
Cover Letter
  ↓
Interview Preparation
  ↓
Application Tracking
  ↓
Dashboard
```

---

# 🔮 Future Improvements

- Pagination and advanced filtering
- Resume version comparison
- More advanced interview evaluation
- Application reminders
- Email notifications
- Job search integrations
- Cloud file storage
- Automated API tests
- More advanced AI-assisted recommendations
- Frontend dashboard

---

# 👨‍💻 Author

**Parvez Rahman**

Full Stack / Frontend Developer focused on TypeScript, React, Next.js, Node.js, Express, PostgreSQL, Prisma, and AI-assisted application development.

---

## 📌 Useful Links

| Resource              | Link                                                    |
| --------------------- | ------------------------------------------------------- |
| Live API              | https://job-pilot-server-lovat.vercel.app               |
| Swagger Documentation | https://job-pilot-server-lovat.vercel.app/api-docs/     |
| Health Check          | https://job-pilot-server-lovat.vercel.app/api/v1/health |
