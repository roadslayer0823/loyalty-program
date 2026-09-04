# Loyalty Program System

A sophisticated, full-stack enterprise solution designed to automate customer loyalty workflows. This system enables seamless receipt submission, multi-stage validation, and automated reward issuance through a high-performance React frontend and a robust Node.js backend.

## 🌟 System Overview

The Loyalty Program application provides a centralized workspace for both customers and administrators. Users can securely upload proof-of-purchase, track their submission status, and manage their earned vouchers. Administrators are empowered with a dedicated validation engine to verify transactions and maintain system integrity, ensuring that every reward issued is backed by a legitimate purchase.

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Axios, React Router DOM, Lucide Icons |
| **Backend** | Node.js, Express.js, Prisma ORM, JWT, Multer, Zod |
| **Database** | PostgreSQL |
| **Dev/Tools** | Nodemon, Bcryptjs, Dotenv, REST API |

## 📂 Repository Structure

```text
├── backend/   # Node.js API with Prisma ORM & PostgreSQL
├── frontend/  # React SPA built with Vite
└── README.md  # Main System Overview (This file)
```

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **PostgreSQL** (v14 or higher)

## 🚀 Quick Start & Launch Guide

### 1. Database Setup
Ensure your PostgreSQL server is running and create a database named `loyalty_db` (or your preferred name).

### 2. Backend Configuration
```bash
cd backend
npm install
# Configure .env based on .env.example
npx prisma migrate deploy
npx prisma db seed # Creates initial admin: admin@loyalty.com / Admin123!
npm run dev
```

### 3. Frontend Configuration
Open a new terminal:
```bash
cd frontend
npm install
# Configure .env based on .env.example
npm run dev
```

The application will be accessible at `http://localhost:5173` (Frontend) and `http://localhost:5000` (Backend API).
## 🏗️ High-Level System Architecture

- **Decoupled Architecture**: Independent React SPA frontend communicating with a RESTful Express API via Axios.
- **State & Session Persistence**: LocalStorage-backed `AuthContext` managing client sessions, paired with stateless JWT verification on protected backend endpoints.
- **Transaction-Safe Rewards**: Atomic database operations (`prisma.$transaction`) ensure receipt approval and unique voucher generation occur together, preventing duplicate issuance.
- **Input & File Validation**: Dual-layer validation using **Zod** for schema enforcement and **Multer** for file size/MIME-type checks on receipt uploads.

## 🤖 AI-Assisted Development Note

AI tools (GitHub Copilot and LLMs) were utilized during development for rapid boilerplate generation, UI layout structuring, and Zod schema drafting. Core business logic, Prisma migration schemas, authentication middleware, and security practices were independently reviewed and verified.
## 📖 Detailed Documentation

For specific technical specifications, API documentation, and architecture decisions, please refer to the internal README files:

- [**Frontend Documentation**](./frontend/README.md) - UI components, state management, and routing.
- [**Backend Documentation**](./backend/README.md) - Database schema, controller logic, and security middleware.

---
*Loyalty Program Full-Stack © 2026*
