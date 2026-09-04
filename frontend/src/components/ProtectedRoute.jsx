import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Acts as a basic security guard for pages that require any logged-in user
 * (e.g., User Dashboard, Submit Receipt, Voucher List).
 *
 * @param {ReactNode} children - The protected page/component to display if authenticated
 */
const ProtectedRoute = ({ children }) => {
  // 1. Extract authentication status from global AuthContext
  const { isAuthenticated } = useAuth();

  // 2. CHECK: Is the user logged in?
  // If NOT logged in -> Redirect to /login immediately
  // "replace" prevents the user from hitting the browser "Back" button to return to a protected screen
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. ACCESS GRANTED: User is authenticated
  // Render the requested protected page (the child component)
  return children;
};

export default ProtectedRoute;
