/**
 * @fileoverview User Vouchers Component.
 * Displays all loyalty vouchers earned by the authenticated user.
 *
 * @route /my-vouchers
 * @access User
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Ticket, Copy, Check, SearchX, PlusCircle } from 'lucide-react';

/**
 * MyVouchers Component.
 * Fetches and lists the user's vouchers with copy-to-clipboard functionality.
 *
 * @returns {JSX.Element} The rendered user vouchers page.
 */
const MyVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  /**
   * Fetches the user's issued vouchers from the API on mount.
   *
   * @async
   * @function fetchVouchers
   */
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await api.get('/users/vouchers');
        setVouchers(response.data);
      } catch (err) {
        setError('Failed to fetch vouchers.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  /**
   * Copies the provided voucher code to the system clipboard.
   * Sets a temporary "copied" state for visual feedback.
   *
   * @function copyToClipboard
   * @param {string} code - The voucher code to copy.
   */
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    // Reset copy feedback after 2 seconds
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) return <div className="loading-state">Loading your vouchers...</div>;

  return (
    <div className="vouchers-container">
      <h1 className="page-title">My Voucher</h1>

      {error && (
        <div className="centered-content">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {vouchers.length === 0 ? (
        <div className="empty-state">
          <SearchX size={64} />
          <p>No vouchers earned yet.</p>
          <Link to="/submit-receipt" className="action-btn primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            <PlusCircle size={20} />
            <span>Submit a receipt to earn your first voucher!</span>
          </Link>
        </div>
      ) : (
        <div className="vouchers-grid">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="voucher-card">
              <div className="voucher-header">
                <Ticket size={24} className="voucher-icon" />
                <span className="badge badge-success">ACTIVE</span>
              </div>

              <div className="voucher-body">
                <h3>Voucher Code</h3>
                <div className="code-box">
                  <code>{voucher.code}</code>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(voucher.code)}
                    title="Copy to clipboard"
                  >
                    {copiedCode === voucher.code ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <div className="voucher-details">
                  <div className="detail-item">
                    <span>Order ID:</span>
                    <strong>{voucher.receipt?.orderId}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Issued On:</span>
                    <strong>{new Date(voucher.createdAt).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVouchers;
