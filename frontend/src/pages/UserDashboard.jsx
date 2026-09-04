/**
 * @fileoverview User Dashboard Component.
 * Provides regular users with an overview of their receipt status and available vouchers.
 *
 * @route /dashboard
 * @access User
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FileText, CheckCircle, Ticket, PlusCircle, ArrowRight } from 'lucide-react';

/**
 * UserDashboard Component.
 * Fetches and displays user-specific metrics and quick action links.
 *
 * @returns {JSX.Element} The rendered user dashboard page.
 */
const UserDashboard = () => {
  const [stats, setStats] = useState({
    pendingReceipts: 0,
    approvedReceipts: 0,
    availableVouchers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetches the user's dashboard statistics from the API on mount.
   *
   * @async
   * @function fetchStats
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/dashboard');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="page-title">User Dashboard</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon"><FileText size={32} /></div>
          <div className="stat-content">
            <h3>Pending Receipts</h3>
            <p className="stat-value">{stats.pendingReceipts}</p>
          </div>
        </div>

        <div className="stat-card approved">
          <div className="stat-icon"><CheckCircle size={32} /></div>
          <div className="stat-content">
            <h3>Approved Receipts</h3>
            <p className="stat-value">{stats.approvedReceipts}</p>
          </div>
        </div>

        <div className="stat-card vouchers">
          <div className="stat-icon"><Ticket size={32} /></div>
          <div className="stat-content">
            <h3>Available Vouchers</h3>
            <p className="stat-value">{stats.availableVouchers}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/submit-receipt" className="action-btn primary">
            <PlusCircle size={20} />
            <span>Submit New Receipt</span>
          </Link>
          <Link to="/my-vouchers" className="action-btn secondary">
            <Ticket size={20} />
            <span>View My Vouchers</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
