/**
 * @fileoverview Admin Receipts Management Component.
 * This page allows administrators to view, filter, and validate (approve/reject)
 * receipts submitted by users.
 *
 * @route /manage-receipts
 * @access Admin
 */

import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Check, X, Image as ImageIcon, SearchX, Filter } from 'lucide-react';

/**
 * AdminReceipts Component.
 * Manages the state and logic for receipt validation workflow.
 *
 * @returns {JSX.Element} The rendered admin receipts validation page.
 */
const AdminReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({ show: false, receiptId: null, reason: '' });

  /**
   * Fetches the list of all receipts from the backend.
   * Updates the receipts state and applies the current filter.
   *
   * @async
   * @function fetchReceipts
   */
  const fetchReceipts = async () => {
    try {
      const response = await api.get('/admin/receipts');
      setReceipts(response.data);
      applyFilter(response.data, filter);
    } catch (err) {
      setError('Failed to fetch receipts list.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initial fetch of receipts on component mount.
   */
  useEffect(() => {
    fetchReceipts();
  }, []);

  /**
   * Auto-hide notifications (error/success messages) after 3 seconds.
   */
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  /**
   * Filters the receipt data based on the provided status.
   *
   * @function applyFilter
   * @param {Array} data - The array of receipt objects to filter.
   * @param {string} status - The status to filter by ('ALL', 'PENDING', 'APPROVED', 'REJECTED').
   */
  const applyFilter = (data, status) => {
    if (status === 'ALL') {
      setFilteredReceipts(data);
    } else {
      setFilteredReceipts(data.filter(r => r.status === status));
    }
  };

  /**
   * Handles the change of the status filter.
   *
   * @function handleFilterChange
   * @param {string} status - The new status filter to apply.
   */
  const handleFilterChange = (status) => {
    setFilter(status);
    applyFilter(receipts, status);
  };

  /**
   * Handles updating the status of a pending receipt.
   * Sends a request to the backend to approve or reject a submission.
   *
   * @async
   * @function handleUpdateStatus
   * @param {number} id - The ID of the receipt to update.
   * @param {string} status - The new status ('APPROVED' or 'REJECTED').
   * @param {string|null} [reason=null] - Optional reason for rejection.
   */
  const handleUpdateStatus = async (id, status, reason = null) => {
    setProcessingId(id);
    setError('');
    setSuccess('');

    const payload = { status };
      if (status === 'REJECTED' && reason) {
        payload.rejectionReason = reason;
    }

    try {
      await api.patch(`/admin/receipts/${id}/status`, payload);
      setSuccess(`Receipt ${status.toLowerCase()} successfully!`);
      // Refresh local data to reflect changes
      fetchReceipts();
      // Close rejection modal if it was open
      setRejectionModal({ show: false, receiptId: null, reason: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update receipt status.');
    } finally {
      setProcessingId(null);
    }
  };

  /**
   * Returns the appropriate CSS class for a status badge.
   *
   * @function getStatusClass
   * @param {string} status - The receipt status.
   * @returns {string} The CSS class name for the badge.
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  if (loading) return <div className="loading-state">Loading receipts...</div>;

  return (
    <div className="admin-receipts-container">
      <h1 className="page-title">Receipt Validation</h1>

      <div className="notification-container">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </div>

      <div className="filter-bar">
        <div className="filter-label">
          <Filter size={18} />
          <span>Filter by Status:</span>
        </div>
        <div className="filter-options">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => handleFilterChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredReceipts.length === 0 ? (
        <div className="empty-state">
          <SearchX size={64} />
          <p>No receipts found for this filter.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Order ID</th>
                <th>Purchase Info</th>
                <th>Status</th>
                <th>Proof</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td>
                    <div className="user-info">
                      <span className="bold">{receipt.user?.name}</span>
                      <small>{receipt.user?.email}</small>
                      {receipt.user?.phone && <small>{receipt.user?.phone}</small>}
                    </div>
                  </td>
                  <td className="bold">{receipt.orderId}</td>
                  <td>
                    <div className="purchase-info">
                      <span>RM {receipt.amount.toFixed(2)}</span>
                      <small>{new Date(receipt.purchaseDate).toLocaleDateString()}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusClass(receipt.status)}`}>
                      {receipt.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedImage(`http://localhost:5000/uploads/${receipt.imageUrl}`)}
                    >
                      <ImageIcon size={16} />
                      <span>View</span>
                    </button>
                  </td>
                  <td>
                    {receipt.status === 'PENDING' ? (
                      <div className="admin-actions">
                        <button
                          className="action-icon-btn approve"
                          disabled={processingId === receipt.id}
                          onClick={() => handleUpdateStatus(receipt.id, 'APPROVED')}
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          className="action-icon-btn reject"
                          disabled={processingId === receipt.id}
                          onClick={() => setRejectionModal({ show: true, receiptId: receipt.id, reason: '' })}
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>&times;</button>
            <img src={selectedImage} alt="Receipt Proof" />
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModal.show && (
        <div className="modal-overlay">
          <div className="modal-content auth-card rejection-modal">
            <h3>Reject Receipt</h3>
            <p>Please provide a reason for rejection:</p>
            <div className="form-group">
              <textarea
                className="modal-textarea"
                value={rejectionModal.reason}
                onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
                placeholder="e.g. Blurred image or invalid Order ID"
                maxLength="40"
              />
              <small className="char-limit-text">
                {rejectionModal.reason.length}/40 characters
              </small>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn confirm"
                onClick={() => handleUpdateStatus(rejectionModal.receiptId, 'REJECTED', rejectionModal.reason)}
                disabled={processingId}
              >
                {processingId ? 'Processing...' : 'Confirm Reject'}
              </button>
              <button
                className="modal-btn cancel"
                onClick={() => setRejectionModal({ show: false, receiptId: null, reason: '' })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReceipts;
