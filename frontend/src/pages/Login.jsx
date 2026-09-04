/**
 * @fileoverview User Login Component.
 * Handles user authentication via email/phone and password.
 *
 * @route /login
 * @access Public
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Login Component.
 * Manages the login form state and authentication request.
 *
 * @returns {JSX.Element} The rendered login page.
 */
const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [sessionMsg, setSessionMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Checks for session expiration messages stored in sessionStorage on mount.
   */
  useEffect(() => {
    // Check for session expiration message
    const authError = sessionStorage.getItem('authError');
    if (authError) {
      setSessionMsg('Session expired. Please log in again.');
      sessionStorage.removeItem('authError');
    }
  }, []);

  /**
   * Auto-hide notifications after 3 seconds.
   */
  useEffect(() => {
    if (error || sessionMsg) {
      const timer = setTimeout(() => {
        setError('');
        setSessionMsg('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, sessionMsg]);

  /**
   * Handles input changes for the form fields.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  /**
   * Handles form submission for user login.
   * On success, updates the global auth context and redirects based on user role.
   *
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSessionMsg('');

    try {
      const response = await api.post('/auth/login', {
        identifier: formData.identifier,
        password: formData.password
      });

      const { user, token } = response.data;
      login(user, token);

      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email/phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-content">
      <div className="auth-container">
        <div className="auth-card">
        <h2>Login</h2>

        <div className="notification-container">
          {sessionMsg && <div className="alert alert-warning">{sessionMsg}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">Email or Phone Number</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              placeholder="e.g. admin@loyalty.com or +60123456789"
              value={formData.identifier}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
