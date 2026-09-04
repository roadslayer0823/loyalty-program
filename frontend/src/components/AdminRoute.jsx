import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoute Component
 * Acts as a security guard for Admin-only pages.
 *
 * @param {ReactNode} children - The Admin component/page to display if checks pass
 */
const AdminRoute = ({ children }) => {
  // 1. Extract authentication status and admin role check from global AuthContext
  const { isAuthenticated, isAdmin } = useAuth();

  // 2. CHECK 1: Is the visitor logged in?
  // If NOT logged in -> Redirect to Login page immediately
  // "replace" overwrites browser history so clicking the "Back" button won't loop them back here
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. CHECK 2: Is the logged-in user an Admin?
  // If logged in BUT role is "USER" (not ADMIN) -> Redirect to standard User Dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. ACCESS GRANTED: User is logged in AND is an admin
  // Render the protected admin page (the child component)
  return children;
};

export default AdminRoute;
