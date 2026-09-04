import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import SubmitReceipt from './pages/SubmitReceipt';
import ReceiptHistory from './pages/ReceiptHistory';
import MyVouchers from './pages/MyVouchers';
import UserSettings from './pages/UserSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminReceipts from './pages/AdminReceipts';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="container">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes (Protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit-receipt"
              element={
                <ProtectedRoute>
                  <SubmitReceipt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-receipts"
              element={
                <ProtectedRoute>
                  <ReceiptHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-vouchers"
              element={
                <ProtectedRoute>
                  <MyVouchers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <UserSettings />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes (Admin Only) */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/manage-receipts"
              element={
                <AdminRoute>
                  <AdminReceipts />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
