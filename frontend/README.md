# Loyalty Program Frontend

A modern, responsive React web application built with Vite, serving as the interface for the Loyalty Program system. This application allows users to submit purchase receipts for verification and receive rewards, while providing administrators with a robust workspace to manage and validate submissions.

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **API Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern CSS3 (App.css) with a clean, white-card aesthetic.
- **State Management**: React Context API (AuthContext)

## 📁 Folder Architecture

```text
src/
├── api/            # Axios instance and API interceptors
├── components/     # Reusable UI components (Navbar, Protected Routes)
├── context/        # Global state providers (Authentication)
├── pages/          # Full-page components (Dashboard, Login, etc.)
├── assets/         # Static assets (images, logos)
├── App.jsx         # Main application routing and layout
├── main.jsx        # Application entry point
└── App.css         # Global styling and component themes
```

## ⚙️ Environment Variables

Create a `.env` file in the `frontend` directory to configure the backend connection:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🛠️ Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **Backend API** running (refer to the backend README)

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Launch the development server:
```bash
npm run dev
```

### Build
Generate a production-ready build:
```bash
npm run build
```

## ✨ Key Features

### Authentication & Profile
- **Dual-Mode Login**: Authenticate using either Email or Phone Number.
- **Persistent Session**: JWT-based state management with automatic re-login on refresh.
- **Route Guarding**: Granular access control using `ProtectedRoute` and `AdminRoute`.
- **Profile Management**: Update name, email, and phone with instant validation and auto-hiding notifications.

### Member Workflow
- **Dashboard**: High-level overview of submission statuses and reward counts.
- **Submit Receipt**: 
  - Drag-and-drop file upload zone.
  - Client-side validation (Max 5MB, JPEG/PNG).
  - Instant image preview before submission.
- **Receipt History**: Responsive table with status badges and full-screen image inspection modal.
- **My Vouchers**: reward grid with "Copy to Clipboard" functionality for voucher codes.

### Admin Workflow
- **System Overview**: Dashboard tracking global metrics and total vouchers issued.
- **Validation Workspace**: 
  - Centralized management of all user submissions.
  - Quick status filtering (All, Pending, Approved, Rejected).
  - One-click approval and specialized rejection modal with custom reasons.

## 🤖 AI-Assisted Development Note
This project utilized AI tools (such as GitHub Copilot and LLMs) for boilerplate generation, component structuring, and UI refinement as permitted by the assessment rules. The application architecture and core user flows were reviewed and refined to ensure system robustness.

---
*Loyalty Program Frontend © 2026*
