/**
 * @fileoverview Submit Receipt Component.
 * Allows users to upload receipt details and images for verification.
 *
 * @route /submit-receipt
 * @access User
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Upload, X, FileImage } from 'lucide-react';

/**
 * SubmitReceipt Component.
 * Manages form state for receipt data and handling multipart file uploads.
 *
 * @returns {JSX.Element} The rendered receipt submission page.
 */
const SubmitReceipt = () => {
  const [formData, setFormData] = useState({
    orderId: '',
    purchaseDate: '',
    amount: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  /**
   * Handles text input changes and clears associated validation errors.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  };

  /**
   * Handles file selection, validation (size/type), and generates a preview.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
        return;
      }
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(selectedFile.type)) {
        setError('Only JPEG, JPG, and PNG images are allowed.');
        return;
      }

      setFile(selectedFile);
      setError('');

      // Create local preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  /**
   * Resets the selected file and preview state.
   */
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /**
   * Handles form submission using FormData for multipart/form-data.
   *
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!file) {
      setError('Please select a receipt image.');
      return;
    }

    const data = new FormData();
    data.append('orderId', formData.orderId);
    data.append('purchaseDate', formData.purchaseDate);
    data.append('amount', formData.amount);
    data.append('image', file);

    setLoading(true);

    try {
      await api.post('/receipts', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Receipt submitted successfully!');
      navigate('/my-receipts');
    } catch (err) {
      if (err.response?.data?.errors) {
        // Map backend validation errors to local state
        const backErrors = {};
        err.response.data.errors.forEach(e => {
          backErrors[e.path[0]] = e.message;
        });
        setValidationErrors(backErrors);
      } else {
        setError(err.response?.data?.message || 'Failed to submit receipt.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-content">
      <div className="auth-container submit-receipt-container">
      <div className="auth-card">
        <h2>Submit Receipt</h2>
        <p>Upload your purchase details to earn vouchers</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="orderId">Order ID</label>
            <input
              type="text"
              id="orderId"
              name="orderId"
              placeholder="e.g. ORD-123456"
              value={formData.orderId}
              onChange={handleInputChange}
              required
            />
            {validationErrors.orderId && <span className="error-text">{validationErrors.orderId}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="purchaseDate">Purchase Date</label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                required
              />
              {validationErrors.purchaseDate && <span className="error-text">{validationErrors.purchaseDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="amount">Total Amount (RM)</label>
              <input
                type="number"
                step="0.01"
                id="amount"
                name="amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
              {validationErrors.amount && <span className="error-text">{validationErrors.amount}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Receipt Image</label>
            <div
              className={`upload-zone ${preview ? 'has-preview' : ''}`}
              onClick={() => !preview && fileInputRef.current.click()}
            >
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Receipt preview" />
                  <button type="button" className="remove-preview" onClick={removeFile}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={40} />
                  <p>Click to select or drag & drop receipt image</p>
                  <span>JPEG, JPG, PNG (Max 5MB)</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Receipt'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default SubmitReceipt;
