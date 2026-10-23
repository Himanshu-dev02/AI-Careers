<div align="center">
# 🚀 NextRole AI
 
### The AI-powered career copilot that takes you from **resume → offer letter**
 
Analyse your resume against ATS systems, discover roles that actually fit, generate a recruiter-ready resume, and rehearse interviews — all in one full-stack platform.
 
<br/>
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=for-the-badge&logo=razorpay&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
 
[✨ Features](#-features) •
[🏗️ Architecture](#️-architecture) •
[🧰 Tech Stack](#-tech-stack) •
[⚡ Getting Started](#-getting-started) •
[🐳 Docker](#-run-with-docker) •
[🔌 API](#-api-reference) •
[🗺️ Roadmap](#️-roadmap)
 
</div>
---

## 📌 Overview

Job hunting is noisy: resumes get filtered by ATS bots before a human reads them, people apply blindly to roles that don't fit, and interview prep is generic.

**NextRole AI** tackles all four problems in one product. Users sign in with Google, upload a PDF resume (or enter their skills manually), and Google **Gemini** returns **structured, actionable JSON** that the UI renders as score rings, match cards, downloadable reports and ready-to-print resumes.

It is a production-style full-stack app with **OAuth authentication, JWT-protected APIs, a freemium usage quota, and real payments via Razorpay**.

---

## ✨ Features

| | Module | What it does |
|---|---|---|
| 📊 | **AI Resume Analyser** | Upload a PDF and get an **ATS score (0–100)** with a breakdown across *formatting, keywords, structure and readability*, prioritised suggestions (🔴 high / 🟡 medium / 🟢 low) and strengths. Export the full report as a styled HTML file. |
| 🎯 | **Smart Job Matcher** | Extracts your profile from a resume **or** manual skills + experience and recommends the **5 best-fit roles**, each with a match %, work type, required skills, *why it matches* and a tailored *apply tip*. |
| 📝 | **AI Resume Builder** | Two modes: **build from scratch** via a guided form, or **improve an existing PDF**. Produces an ATS-optimised resume with action-verb bullets and a professional summary, exported to a clean **A4 PDF** in-browser. |
| 🎤 | **Interview Prep** | Generates **10 progressively harder questions** with answer hints and categories, for either an **HR/behavioural** or **technical** round, based on your resume or skills. Download as PDF. |
| 🔐 | **Google Sign-In** | One-click OAuth 2.0 login, JWT sessions (15-day expiry), protected & public route guards. |
| 💳 | **Freemium + Payments** | 3 free AI requests per user, then upgrade to **Pro Monthly (₹299)** or **Pro 6-Month (₹1,499)** through Razorpay with server-side signature verification. |

---

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph Client["🖥️ Frontend · React 19 + Vite"]
        UI["Pages: Analyse · Job Matcher<br/>Resume Builder · Interview Prep"]
        CTX["AppContext<br/>(auth state)"]
        PDF["jsPDF<br/>client-side export"]
    end

    subgraph Server["⚙️ Backend · Express 5 + TypeScript"]
        AUTH["isAuth middleware<br/>(JWT verify)"]
        AI["AI Controller"]
        USER["User Controller"]
        PAY["Payment Controller"]
        PROMPT["Prompt Templates"]
    end

    DB[("🍃 MongoDB<br/>Users · Quota · Subscription")]
    GEM["✨ Google Gemini API"]
    GOOG["🔑 Google OAuth 2.0"]
    RZP["💳 Razorpay"]

    UI --> CTX
    UI -->|REST + Bearer JWT| AUTH
    AUTH --> AI & USER & PAY
    AI --> PROMPT --> GEM
    USER <--> GOOG
    PAY <--> RZP
    AI & USER & PAY <--> DB
    UI --> PDF
```

### 🔄 Request lifecycle (AI endpoints)

```mermaid
sequenceDiagram
    participant U as User
    participant F as React App
    participant B as Express API
    participant D as MongoDB
    participant G as Gemini

    U->>F: Upload resume PDF
    F->>F: Convert to Base64
    F->>B: POST /api/ai/analyse (Bearer JWT)
    B->>B: Verify JWT (isAuth)
    B->>D: Load user, check quota / Pro status
    alt Quota exhausted & not Pro
        B-->>F: 403 Upgrade your plan
    else Allowed
        B->>G: Prompt + inline PDF (multimodal)
        G-->>B: Structured JSON
        B->>B: Sanitise & validate JSON
        B->>D: Increment freeRequestsUsed (free users)
        B-->>F: JSON result
        F-->>U: Score rings, cards, downloadable report
    end
```
### 🐳 Container topology
 
```mermaid
flowchart LR
    BR["🌐 Browser<br/>localhost:5173"]
 
    subgraph DC["🐳 Docker Compose"]
        FE["frontend<br/>Nginx serves the Vite build<br/>container :80"]
        BE["backend<br/>Node 22 · Express 5<br/>container :5000"]
        MG[("mongo 7<br/>optional · profile local-db")]
    end
 
    ATLAS[("🍃 MongoDB Atlas")]
 
    BR -->|static app| FE
    BR -->|REST + JWT| BE
    BE -.->|MONGO_URI| MG
    BE -.->|MONGO_URI| ATLAS
```
 

---

## 🧠 Engineering Highlights

- **Multimodal LLM pipeline** — PDFs are sent directly to Gemini as inline data, so no brittle PDF-parsing step; prompts enforce a strict JSON schema so responses map straight onto typed React components.
- **Defensive AI handling** — responses are stripped of markdown fences, JSON-parsed in a guarded block, and empty/invalid outputs return clear errors without consuming the user's quota.
- **Usage metering built into the data model** — `hasProAcess()` and `canMakeRequest()` live on the Mongoose schema, keeping quota logic in one place across all four AI endpoints.
- **Secure payments** — orders are created server-side; on completion the **HMAC-SHA256 signature is verified** with the Razorpay secret before the subscription expiry is written.
- **Auth done properly** — Google OAuth authorization-code flow → JWT; every AI and payment route sits behind an `isAuth` middleware; frontend uses `ProtectedRoutes` / `PublicRoutes` guards.
- **Zero-server exports** — resume and interview PDFs are generated entirely in the browser with **jsPDF** (lazy-loaded to keep the initial bundle small).
- **Containerised with multi-stage Docker builds** — TypeScript is compiled in a build stage and only the production output ships; the React app is built by Vite and served by **Nginx** with SPA routing and long-lived asset caching. `docker compose up --build` starts the whole stack.
- **End-to-end TypeScript** — shared domain models (`Analysis`, `ResumeData`, `InterviewData`, `Job`) typed on the client; typed Express request extensions on the server.

---

## 🧰 Tech Stack

**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS v4
- React Router v7, Context API
- `@react-oauth/google`, Axios, react-hot-toast, Lucide icons
- jsPDF for client-side PDF generation

**Backend**
- Node.js, Express 5, TypeScript (ES modules)
- MongoDB + Mongoose
- Google Gemini via `@google/genai`
- Google OAuth (`googleapis`), JSON Web Tokens
- Razorpay SDK

**DevOps**
- Docker (multi-stage builds), Docker Compose
- Nginx (static hosting + SPA fallback)
---

## 📁 Project Structure
```
AI-Careers/
├── docker-compose.yml       # frontend + backend (+ optional local Mongo)
├── backend/
│   ├── Dockerfile           # multi-stage: tsc build → slim runtime
│   └── src/
│       ├── config/          # db, Google OAuth client, Gemini prompt templates
│       ├── controllers/     # ai · user · payment
│       ├── middlewares/     # isAuth (JWT), trycatch (async error wrapper)
│       ├── models/          # User schema + subscription/quota methods
│       ├── routes/          # /api/ai · /api/user · /api/payment
│       └── index.ts         # app entry
└── frontend/
    ├── Dockerfile           # multi-stage: Vite build → Nginx
    ├── nginx.conf           # SPA fallback + asset caching
    └── src/
        ├── components/      # navbar, hero, features, pricing, route guards…
        ├── context/         # AppContext (auth + user state)
        ├── pages/           # Home, Login, Analyse, JobMatcher,
        │                    # BuildResume, Interview, Account
        ├── config.ts        # API base URL (VITE_SERVER)
        ├── index.css        # theme, animations, design tokens
        ├── types.ts         # shared TypeScript models
        └── utils.ts         # plans, PDF/report generators, helpers
```
 
---
 
## ⚡ Getting Started
 
### Prerequisites
- **Docker Desktop** *(recommended)*, **or** Node.js 20+
- A MongoDB database (Atlas, or the optional local container)
- [Google Cloud OAuth credentials](https://console.cloud.google.com/apis/credentials) — a **Web application** client with `http://localhost:5173` added under *Authorized JavaScript origins*
- A [Gemini API key](https://aistudio.google.com/app/apikey)
- A [Razorpay](https://razorpay.com/) account (test mode is fine)
### 1. Clone
 
```bash
git clone https://github.com/Himanshu-dev02/AI-Careers.git
cd AI-Careers
```
 
### 2. Configure environment
 
**`backend/.env`** — secrets, read by the API:
 
```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
JWT_SEC=<a-long-random-secret>
API_KEY_GEMINI=<your-gemini-api-key>
Razorpay_Key=<your-razorpay-key-id>
Razorpay_Secret=<your-razorpay-key-secret>
```
 
**Frontend variables** — public values, baked into the build by Vite:
 
```env
VITE_SERVER=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=<same-client-id-as-GOOGLE_CLIENT_ID>
```
 
- With **Docker**, put these in a `.env` file in the **project root** (next to `docker-compose.yml`).
- Running **manually**, put them in `frontend/.env`.
- The Razorpay **Key ID** used by the checkout is set in `frontend/src/components/pricing.tsx`. It must be the same key as `Razorpay_Key` in the backend.
> 🔒 **Never commit `.env` files.** Rotate any key that has ever been pushed to a public repository.
 
### 3. Run it
 
**Option A — Docker (recommended)** — see [Run with Docker](#-run-with-docker):
 
```bash
docker compose up --build
```
 
**Option B — manually**
 
```bash
# terminal 1 — backend
cd backend
npm install
npm run dev          # tsc --watch + node --watch  (or: npm run build && npm start)
 
# terminal 2 — frontend
cd frontend
npm install
npm run dev
```
 
Open **http://localhost:5173**.
 
---
 
## 🐳 Run with Docker
 
One command starts the whole stack. Both images use **multi-stage builds**, so the final containers carry only what they need to run.
 
| Service    | Image                                 | URL                     |
|------------|---------------------------------------|-------------------------|
| `frontend` | Vite build served by `nginx:alpine`   | http://localhost:5173   |
| `backend`  | `node:22-slim`, compiled TypeScript   | http://localhost:5000   |
 
 
```bash
# 1. create backend/.env and the root .env (see "Configure environment")
 
# 2. build and start
docker compose up --build
```
 
**Use a local MongoDB instead of Atlas**
 
```bash
# in backend/.env
MONGO_URI=mongodb://mongo:27017/ai-careers
 
docker compose --profile local-db up --build
```
 
Data is kept in the `mongo-data` volume.

## 🔌 API Reference

All routes except `/api/user/login` require `Authorization: Bearer <JWT>`.

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/user/login` | Exchange Google auth code for a JWT + user profile |
| `GET`  | `/api/user/me` | Current user, subscription & quota |
| `POST` | `/api/ai/analyse` | ATS analysis of an uploaded PDF resume |
| `POST` | `/api/ai/job-matcher` | Top 5 role matches (`mode`: `manual` \| `resume`) |
| `POST` | `/api/ai/interview` | 10-question HR or technical set (`round`: `hr` \| `technical`) |
| `POST` | `/api/ai/resume-build` | Generate or improve a resume (`mode`: `manual` \| `improve`) |
| `POST` | `/api/payment/checkout` | Create a Razorpay order for a plan |
| `POST` | `/api/payment/verify` | Verify payment signature and activate Pro |

<details>
<summary><b>Example response — <code>POST /api/ai/analyse</code></b></summary>

```json
{
  "atsScore": 85,
  "scoreBreakdown": {
    "formatting":  { "score": 90, "feedback": "Clean single-column layout." },
    "keywords":    { "score": 80, "feedback": "Missing several role-specific terms." },
    "structure":   { "score": 85, "feedback": "Standard section headings used." },
    "readability": { "score": 88, "feedback": "Concise, action-oriented bullets." }
  },
  "suggestions": [
    {
      "category": "Keywords",
      "issue": "No mention of CI/CD tooling",
      "recommendation": "Add relevant tools you've used, e.g. GitHub Actions.",
      "priority": "high"
    }
  ],
  "strengths": ["Quantified achievements", "ATS-safe formatting"],
  "summary": "A strong resume that would benefit from richer keyword coverage."
}
```
</details>

---

## 🗺️ Roadmap

- [ ] Persist analysis & interview history per user
- [ ] Interactive mock-interview mode with AI answer feedback
- [ ] Job-description ↔ resume tailoring (keyword gap vs. a pasted JD)
- [ ] Rate limiting, request validation (Zod) and Razorpay webhooks
- [ ] Multiple resume templates and DOCX export
- [ ] Dockerised deployment + CI pipeline
- [ ] Health-check endpoint and container healthchecks
- [ ] Unit & integration tests

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m "feat: add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👤 Author

**Himanshu Meshram**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Himanshu-dev02)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/%20himanshu-meshram-hm)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](meshramhimanshu20@gmail.com)

---

<div align="center">

⭐ **If you found this project useful, please consider giving it a star!** ⭐

</div>