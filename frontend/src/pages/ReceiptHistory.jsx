/**
 * @fileoverview User Receipt History Component.
 * Displays a list of all receipts submitted by the authenticated user.
 *
 * @route /my-receipts
 * @access User
 */

import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Eye, Image as ImageIcon, SearchX } from 'lucide-react';

/**
 * ReceiptHistory Component.
 * Fetches and displays the user's past receipt submissions in a table.
 *
 * @returns {JSX.Element} The rendered receipt history page.
 */
const ReceiptHistory = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  /**
   * Fetches the user's receipt history from the API on component mount.
   *
   * @async
   * @function fetchReceipts
   */
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await api.get('/receipts/my');
        setReceipts(response.data);
      } catch (err) {
        setError('Failed to fetch receipt history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  /**
   * Maps receipt status to the corresponding CSS badge class.
   *
   * @function getStatusClass
   * @param {string} status - The receipt status (PENDING, APPROVED, REJECTED).
   * @returns {string} The CSS class name for styling the badge.
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  if (loading) return <div className="loading-state">Loading history...</div>;

  return (
    <div className="history-container">
      <h1 className="page-title">My Receipt History</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {receipts.length === 0 ? (
        <div className="empty-state">
          <SearchX size={64} />
          <p>You haven't submitted any receipts yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Purchase Date</th>
                <th>Amount</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Rejection Reason</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td className="bold">{receipt.orderId}</td>
                  <td>{new Date(receipt.purchaseDate).toLocaleDateString()}</td>
                  <td>RM {receipt.amount.toFixed(2)}</td>
                  <td>{new Date(receipt.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${getStatusClass(receipt.status)}`}>
                      {receipt.status}
                    </span>
                  </td>
                  <td>{receipt.rejectionReason || ''}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedImage(`http://localhost:5000/uploads/${receipt.imageUrl}`)}
                    >
                      <ImageIcon size={16} />
                      <span>View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Basic Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>&times;</button>
            <img src={selectedImage} alt="Receipt Full View" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptHistory;
