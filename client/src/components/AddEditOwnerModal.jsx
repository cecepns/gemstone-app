// ANCHOR: AddEditOwnerModal Component - Modal for adding or editing gemstone owners
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addGemstoneOwner, updateGemstoneOwner } from '../utils/api';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';
import { 
  UserPlus, 
  Edit, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { Button, Input, Textarea, Modal } from './ui';

/**
 * AddEditOwnerModal component - Modal for adding or editing gemstone owners
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close modal function
 * @param {Function} props.onSuccess - Success callback function
 * @param {string} props.gemstoneId - Gemstone ID
 * @param {string} props.gemstoneName - Gemstone name for display
 * @param {Object|null} props.editingOwner - Owner data to edit (null for add mode)
 * @returns {React.ReactElement} - Rendered modal component
 */
const AddEditOwnerModal = ({ isOpen, onClose, onSuccess, gemstoneId, gemstoneName, editingOwner }) => {
  const { getAuthHeader } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    owner_address: '',
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
      owner_name: '',
      owner_phone: '',
      owner_email: '',
      owner_address: '',
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

    if (!formData.owner_name.trim()) {
      newErrors.owner_name = 'Nama pemilik harus diisi';
    }

    if (!formData.owner_phone.trim()) {
      newErrors.owner_phone = 'Nomor telepon harus diisi';
    }

    if (!formData.ownership_start_date) {
      newErrors.ownership_start_date = 'Tanggal mulai kepemilikan harus diisi';
    }

    // Validate email format if provided
    if (formData.owner_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner_email)) {
      newErrors.owner_email = 'Format email tidak valid';
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
      showLoading(editingOwner ? 'Memperbarui data pemilik...' : 'Menambahkan pemilik baru...');

      if (editingOwner) {
        // Update existing owner
        await updateGemstoneOwner(gemstoneId, editingOwner.id, formData, getAuthHeader());
        dismissToast();
        showSuccess('Data pemilik berhasil diperbarui');
      } else {
        await addGemstoneOwner(gemstoneId, formData, getAuthHeader());
        dismissToast();
        showSuccess('Pemilik baru berhasil ditambahkan');
      }

      onSuccess(); // Call success callback
      onClose(); // Close modal
    } catch (error) {
      console.error('Error saving owner:', error);
      dismissToast();
      showError(error.message || 'Gagal menyimpan data pemilik');
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

  // Initialize form data when editing
  useEffect(() => {
    if (isOpen && editingOwner) {
      setFormData({
        owner_name: editingOwner.owner_name || '',
        owner_phone: editingOwner.owner_phone || '',
        owner_email: editingOwner.owner_email || '',
        owner_address: editingOwner.owner_address || '',
        ownership_start_date: editingOwner.ownership_start_date || '',
        ownership_end_date: editingOwner.ownership_end_date || '',
        notes: editingOwner.notes || ''
      });
    } else if (isOpen && !editingOwner) {
      resetForm();
    }
  }, [isOpen, editingOwner]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {editingOwner ? (
              <Edit className="w-6 h-6 text-blue-600" />
            ) : (
              <UserPlus className="w-6 h-6 text-green-600" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {editingOwner ? 'Edit Data Pemilik' : 'Tambah Pemilik Baru'}
              </h3>
              <p className="text-sm text-gray-600">{gemstoneName}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Pemilik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pemilik *
              </label>
              <Input
                name="owner_name"
                value={formData.owner_name}
                onChange={handleInputChange}
                placeholder="Masukkan nama pemilik"
                className={errors.owner_name ? 'border-red-500' : ''}
              />
              {errors.owner_name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.owner_name}
                </p>
              )}
            </div>
            
            {/* Nomor Telepon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon *
              </label>
              <Input
                name="owner_phone"
                value={formData.owner_phone}
                onChange={handleInputChange}
                placeholder="Masukkan nomor telepon"
                className={errors.owner_phone ? 'border-red-500' : ''}
              />
              {errors.owner_phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.owner_phone}
                </p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                name="owner_email"
                type="email"
                value={formData.owner_email}
                onChange={handleInputChange}
                placeholder="Masukkan email (opsional)"
                className={errors.owner_email ? 'border-red-500' : ''}
              />
              {errors.owner_email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.owner_email}
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
                max={getCurrentDate()}
                className={errors.ownership_start_date ? 'border-red-500' : ''}
              />
              {errors.ownership_start_date && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.ownership_start_date}
                </p>
              )}
            </div>
            
            {/* Tanggal Berakhir Kepemilikan (only for editing) */}
            {editingOwner && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Berakhir Kepemilikan
                </label>
                <Input
                  name="ownership_end_date"
                  type="date"
                  value={formData.ownership_end_date || ''}
                  onChange={handleInputChange}
                  min={formData.ownership_start_date}
                  max={getCurrentDate()}
                  className={errors.ownership_end_date ? 'border-red-500' : ''}
                />
                {errors.ownership_end_date && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.ownership_end_date}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <Textarea
              name="owner_address"
              value={formData.owner_address}
              onChange={handleInputChange}
              placeholder="Masukkan alamat pemilik (opsional)"
              rows={3}
            />
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
              placeholder="Masukkan catatan tambahan (opsional)"
              rows={3}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit">
              {editingOwner ? 'Perbarui' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEditOwnerModal;
