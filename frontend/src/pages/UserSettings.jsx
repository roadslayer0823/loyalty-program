/**
 * @fileoverview User Settings Component.
 * Allows users to update their profile information (name, email, phone).
 *
 * @route /settings
 * @access User
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

/**
 * UserSettings Component.
 * Manages profile update form state and persistence.
 *
 * @returns {JSX.Element} The rendered user settings page.
 */
const UserSettings = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [serverError, setServerError] = useState('');

  /**
   * Pre-fills the form with existing user data from AuthContext on mount or when user changes.
   */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  /**
   * Auto-hide success or server error messages after 3 seconds.
   */
  useEffect(() => {
    if (successMsg || serverError) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
        setServerError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, serverError]);

  /**
   * Performs client-side validation of the profile settings form.
   *
   * @function validate
   * @returns {Object} An object containing field-specific error messages.
   */
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone format (min 8 digits)';
    }

    return newErrors;
  };

  /**
   * Handles input changes for form fields and clears related error messages.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    setServerError('');
    setSuccessMsg('');
  };

  /**
   * Handles profile update submission.
   * Checks for changes before sending the request to the API.
   * On success, updates the global auth context.
   *
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Check if data has actually changed compared to current user context
    const isUnchanged =
      formData.name === (user?.name || '') &&
      formData.email === (user?.email || '') &&
      formData.phone === (user?.phone || '');

    if (isUnchanged) {
      setSuccessMsg('No changes detected.');
      return;
    }

    // Step 2: Validate input data
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');
    setSuccessMsg('');

    try {
      // Step 3: Send update request to backend
      const response = await api.put('/users/profile', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      // Step 4: Update local context and storage with new user data
      const token = localStorage.getItem('token');
      login(response.data.user, token);

      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      if (err.response?.data?.errors) {
        // Map backend validation (Zod) errors to local state
        const backendErrors = {};
        err.response.data.errors.forEach(e => {
          backendErrors[e.path[0]] = e.message;
        });
        setErrors(backendErrors);
      } else {
        setServerError(err.response?.data?.message || 'Failed to update profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-content">
      <div className="auth-container">
      <div className="auth-card">
        <h2>Profile Settings</h2>
        <p>Update your personal information</p>

        <div className="notification-container">
          {successMsg && <div className="alert alert-success">{successMsg}</div>}
          {serverError && <div className="alert alert-danger">{serverError}</div>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="+60123456789"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default UserSettings;
