import { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the React Context container to hold global authentication data
const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps the entire application to provide global user session state,
 * authentication tokens, and login/logout functions to any child component.
 */
export const AuthProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  // Stores current user details (id, name, email, role)
  const [user, setUser] = useState(null);

  // Reads the saved JWT token from browser storage on initial page load
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Prevents the app from rendering child pages until authentication check completes
  const [loading, setLoading] = useState(true);

  // --- PERSISTENCE CHECK (On App Load / Refresh) ---
  useEffect(() => {
    // Look for saved user session data in browser LocalStorage
    const savedUser = localStorage.getItem('user');

    // If both user data and a JWT token exist, re-hydrate global user state
    if (savedUser && token) {
      setUser(JSON.parse(savedUser)); // Convert JSON string back to JavaScript object
    }

    // Mark initial load as finished so protected routes can safely evaluate state
    setLoading(false);
  }, [token]);

  // --- LOGIN ACTION ---
  const login = (userData, authToken) => {
    // 1. Update React memory state
    setUser(userData);
    setToken(authToken);

    // 2. Persist to browser LocalStorage so session survives page refreshes
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // --- LOGOUT ACTION ---
  const logout = () => {
    // 1. Clear React memory state
    setUser(null);
    setToken(null);

    // 2. Clear browser LocalStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // --- COMPUTED BOOLEAN HELPERS ---
  // Converts token presence into a true/false boolean (true if token exists, false if null)
  const isAuthenticated = !!token;

  // Safe navigation operator (?.) checks if user object exists AND has role === 'ADMIN'
  const isAdmin = user?.role === 'ADMIN';

  return (
    // Pass user state and helper functions down through the Context Provider
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, loading, login, logout }}>
      {/* Only render wrapped application components once initial storage check is done */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook: useAuth()
 * Allows any component (e.g., Header, ProtectedRoute, Login Form)
 * to quickly access authentication context without importing useContext/AuthContext manually.
 */
export const useAuth = () => useContext(AuthContext);
