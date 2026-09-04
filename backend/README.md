# Loyalty Program Backend API

A full-stack backend solution for a Loyalty Program application, enabling users to submit purchase receipts for verification and receive vouchers upon approval. This project is built with Node.js, Express, and PostgreSQL using Prisma ORM.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT) & Bcryptjs
- **Validation**: Zod
- **File Handling**: Multer (Local Storage)
- **Development**: Nodemon

## 🛠️ Getting Started & Setup

### Prerequisites
- **Node.js** (v16+ recommended)
- **PostgreSQL** instance running locally or via Docker.

### Installation
1. Clone the repository.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration
1. Create a `.env` file in the `backend` directory.
2. Refer to `.env.example` for the required variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: A secure string for signing tokens.
   - `PORT`: Server port (default: 5000).

## 🗄️ Database Setup & Migration

1. **Run Migrations**: Create the database schema and apply migrations.
   ```bash
   npx prisma migrate dev --name init
   ```
2. **Prisma Studio**: Launch the GUI to inspect your data.
   ```bash
   npx prisma studio
   ```

## 🔌 API Overview

### Authentication (`/api/auth`)
- `POST /register`: Create a new user account.
- `POST /login`: Authenticate and receive a JWT.

### Receipts (`/api/receipts`)
- `POST /`: Submit a receipt image with metadata (Protected).
- `GET /my`: List receipts submitted by the logged-in user (Protected).

### Admin (`/api/admin`)
- `GET /receipts`: View all submitted receipts across the system (Admin Only).
- `PATCH /receipts/:id/status`: Approve or Reject a receipt (Admin Only).
- `GET /dashboard`: System-wide statistics (Admin Only).

### User (`/api/users`)
- `GET /dashboard`: User-specific receipt and voucher counts (Protected).
- `GET /vouchers`: List all vouchers issued to the user (Protected).
- `PUT /profile`: Update user profile information (Protected).

## 🏗️ Architecture & Design Decisions

- **JWT-Based Authentication**: Secure, stateless authentication using signed tokens. Roles (`USER`, `ADMIN`) are embedded in the token payload to manage access control efficiently.
- **Transaction Handling**: The receipt approval process utilizes `prisma.$transaction`. This ensures that updating a receipt's status to `APPROVED` and generating a unique `Voucher` occur atomically, guaranteeing a strict 1-to-1 relationship and preventing duplicate voucher issuance.
- **Validation**: Strict schema validation using **Zod** for both request bodies and multipart form data, ensuring data integrity before reaching the database.
- **Security**: Passwords are never stored in plain text; they are hashed using **Bcryptjs** before persistence.

## 🤖 AI-Assisted Development Note
This project utilized AI tools (such as GitHub Copilot and LLMs) for boilerplate generation, controller logic structuring, and rapid validation schema design. The core business logic, database design, and architecture were reviewed and refined to ensure system robustness.
---
*Loyalty Program Backend © 2026*
