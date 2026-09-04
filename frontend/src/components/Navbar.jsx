/**
 * @fileoverview Application Navigation Component.
 * Features a top bar with a toggleable sidebar for navigating regular user and admin routes.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

/**
 * Navbar Component.
 * Manages the visibility of the sidebar and handles user logout.
 *
 * @returns {JSX.Element} The rendered navigation bar and sidebar.
 */
const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * Logs the user out, closes the sidebar, and redirects to the login page.
   *
   * @function handleLogout
   */
  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
    navigate('/login');
  };

  /**
   * Toggles the open/closed state of the sidebar menu.
   *
   * @function toggleSidebar
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /**
   * Force closes the sidebar menu.
   *
   * @function closeSidebar
   */
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          {isAuthenticated && (
            <button className="menu-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
              <Menu size={24} />
            </button>
          )}
          <div className="navbar-brand">
            <Link to="/" onClick={closeSidebar}>Loyalty Program</Link>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay: Closes sidebar when background is clicked */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sliding Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-sidebar-btn" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-links">
          {isAuthenticated ? (
            <>
              {/* Dynamic links based on user role */}
              {isAdmin ? (
                <>
                  <Link to="/admin-dashboard" onClick={closeSidebar}>Admin Dashboard</Link>
                  <Link to="/manage-receipts" onClick={closeSidebar}>Manage Receipts</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" onClick={closeSidebar}>Dashboard</Link>
                  <Link to="/submit-receipt" onClick={closeSidebar}>Submit Receipt</Link>
                  <Link to="/my-receipts" onClick={closeSidebar}>My Receipts</Link>
                  <Link to="/my-vouchers" onClick={closeSidebar}>My Vouchers</Link>
                </>
              )}
              <div className="sidebar-divider"></div>
              <Link to="/settings" onClick={closeSidebar}>Settings</Link>
              <button onClick={handleLogout} className="sidebar-logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={closeSidebar}>Login</Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
