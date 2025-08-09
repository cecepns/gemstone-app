// ANCHOR: TransferOwnershipModal Component - Modal for transferring ownership to existing owners
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transferOwnership } from '../utils/api';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';
import { 
  UserPlus, 
  X, 
  AlertCircle,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import { Button, Input, Textarea, Modal, Select } from './ui';

/**
 * TransferOwnershipModal component - Modal for transferring ownership to existing owners
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close modal function
 * @param {Function} props.onSuccess - Success callback function
 * @param {string} props.gemstoneId - Gemstone ID
 * @param {string} props.gemstoneName - Gemstone name for display
 * @param {Object|null} props.currentOwner - Current owner data
 * @param {Array} props.owners - List of all owners for selection
 * @param {Function} props.onAddNewOwner - Callback to open add new owner modal
 * @returns {React.ReactElement} - Rendered modal component
 */
const TransferOwnershipModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  gemstoneId, 
  gemstoneName, 
  currentOwner,
  owners = [],
  onAddNewOwner 
}) => {
  const { getAuthHeader } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    fromOwnerId: '',
    toOwnerId: '',
    ownership_start_date: '',
    ownership_end_date: '',
    notes: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});

  /**
   * Reset form data
   */
  const resetForm = () => {
    setFormData({
      fromOwnerId: '',
      toOwnerId: '',
      ownership_start_date: '',
      ownership_end_date: '',
      notes: ''
    });
    setErrors({});
  };

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.toOwnerId) {
      newErrors.toOwnerId = 'Pemilik tujuan harus dipilih';
    }

    if (!formData.ownership_start_date) {
      newErrors.ownership_start_date = 'Tanggal mulai kepemilikan harus diisi';
    }

    // Validate date range if end date is provided
    if (formData.ownership_end_date && formData.ownership_start_date) {
      const startDate = new Date(formData.ownership_start_date);
      const endDate = new Date(formData.ownership_end_date);
      
      if (endDate <= startDate) {
        newErrors.ownership_end_date = 'Tanggal berakhir harus setelah tanggal mulai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      showLoading('Memproses transfer kepemilikan...');

      await transferOwnership(gemstoneId, formData, getAuthHeader());
      
      dismissToast();
      showSuccess('Kepemilikan berhasil ditransfer');

      onSuccess(); // Call success callback
      onClose(); // Close modal
    } catch (error) {
      console.error('Error transferring ownership:', error);
      dismissToast();
      showError(error.message || 'Gagal mentransfer kepemilikan');
    }
  };

  /**
   * Get current date in YYYY-MM-DD format for date input
   * @returns {string} - Current date in YYYY-MM-DD format
   */
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  /**
   * Get available owners for selection (excluding current owner)
   */
  const getAvailableOwners = () => {
    return owners.filter(owner => owner.id !== currentOwner?.id);
  };

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && currentOwner) {
      setFormData(prev => ({
        ...prev,
        fromOwnerId: currentOwner.id,
        ownership_start_date: getCurrentDate()
      }));
    }
  }, [isOpen, currentOwner]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Transfer Kepemilikan
              </h3>
              <p className="text-sm text-gray-600">{gemstoneName}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dari (Current Owner) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dari (Pemilik Aktif)
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium">
                  {currentOwner?.owner_name || 'Tidak ada pemilik aktif'}
                </p>
                <p className="text-sm text-gray-600">
                  {currentOwner?.owner_phone}
                </p>
              </div>
            </div>

            {/* Ke (Target Owner) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ke (Pemilik Tujuan) *
              </label>
              <Select
                name="toOwnerId"
                value={formData.toOwnerId}
                onChange={handleInputChange}
                className={errors.toOwnerId ? 'border-red-500' : ''}
              >
                <option value="">Pilih pemilik tujuan</option>
                {getAvailableOwners().map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.owner_name} - {owner.owner_phone}
                    {owner.is_current_owner ? ' (Pemilik Aktif)' : ' (Mantan Pemilik)'}
                  </option>
                ))}
              </Select>
              {errors.toOwnerId && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.toOwnerId}
                </p>
              )}
            </div>

            {/* Tanggal Mulai Kepemilikan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai Kepemilikan *
              </label>
              <Input
                name="ownership_start_date"
                type="date"
                value={formData.ownership_start_date}
                onChange={handleInputChange}
                min={getCurrentDate()}
                className={errors.ownership_start_date ? 'border-red-500' : ''}
              />
              {errors.ownership_start_date && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.ownership_start_date}
                </p>
              )}
            </div>

            {/* Tanggal Berakhir Kepemilikan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Berakhir Kepemilikan
              </label>
              <Input
                name="ownership_end_date"
                type="date"
                value={formData.ownership_end_date}
                onChange={handleInputChange}
                min={formData.ownership_start_date}
                className={errors.ownership_end_date ? 'border-red-500' : ''}
              />
              {errors.ownership_end_date && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.ownership_end_date}
                </p>
              )}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan
            </label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Catatan tambahan untuk transfer kepemilikan (opsional)"
              rows={3}
            />
          </div>

          {/* Add New Owner Option */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-blue-600">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Pemilik Tujuan Tidak Ada?
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Jika pemilik tujuan tidak ada dalam daftar, Anda dapat menambahkan pemilik baru terlebih dahulu.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAddNewOwner}
                className="ml-auto"
              >
                Tambah Pemilik Baru
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" disabled={!formData.toOwnerId}>
              Transfer Kepemilikan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TransferOwnershipModal;
