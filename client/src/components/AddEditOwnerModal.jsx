// ANCHOR: AddEditOwnerModal Component - Modal for adding or editing gemstone owners
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addGemstoneOwner, updateGemstoneOwner, getGemstoneOwners, getAllOwners } from '../utils/api';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';
import { 
  UserPlus, 
  Edit, 
  X, 
  AlertCircle,
  Copy,
  Users
} from 'lucide-react';
import { Button, Input, Textarea, Modal, Checkbox, Select } from './ui';

/**
 * AddEditOwnerModal component - Modal for adding or editing gemstone owners
 * 
 * Features:
 * - Add new owner with transfer option
 * - Edit existing owner data
 * - Template selection: Use existing owner data as template for new owner
 * - Visual indicators for template-filled fields
 * 
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
    notes: '',
    is_transfer: false
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Template selector state
  const [availableOwners, setAvailableOwners] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [hasCurrentOwner, setHasCurrentOwner] = useState(false);

  /**
   * Fetch available owners for template selection
   */
  const fetchAvailableOwners = async () => {
    try {
      setIsLoadingTemplates(true);
      console.log('Fetching all owners for template selection');
      const result = await getAllOwners(getAuthHeader());
      console.log('Fetched all owners result:', result);
      setAvailableOwners(result.data || []);
    } catch (error) {
      console.error('Error fetching all owners for template:', error);
      setAvailableOwners([]);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  /**
   * Check if current gemstone has an active owner
   */
  const checkCurrentOwner = async () => {
    try {
      const result = await getGemstoneOwners(gemstoneId, getAuthHeader());
      const hasOwner = result.data && result.data.some(owner => owner.is_current_owner);
      setHasCurrentOwner(hasOwner);
      console.log('Has current owner:', hasOwner);
    } catch (error) {
      console.error('Error checking current owner:', error);
      setHasCurrentOwner(false);
    }
  };

  /**
   * Handle template selection
   * @param {string} ownerId - Selected owner ID
   */
  const handleTemplateSelect = (ownerId) => {
    console.log('=== TEMPLATE SELECTION DEBUG ===');
    console.log('Template selected:', ownerId, 'Type:', typeof ownerId);
    console.log('Available owners count:', availableOwners.length);
    console.log('Available owners:', availableOwners);
    
    if (!ownerId) {
      console.log('No owner ID selected, clearing template');
      setSelectedTemplate('');
      return;
    }

    // Find the selected owner using loose comparison
    const selectedOwner = availableOwners.find(owner => {
      console.log('Comparing:', owner.id, 'with', ownerId, 'Types:', typeof owner.id, typeof ownerId);
      return owner.id == ownerId;
    });
    
    console.log('Selected owner found:', selectedOwner);
    
    if (selectedOwner) {
      console.log('Setting template and updating form...');
      setSelectedTemplate(ownerId);
      
      // Update form data immediately
      setFormData(prev => {
        const newData = {
          ...prev,
          owner_name: selectedOwner.owner_name || '',
          owner_phone: selectedOwner.owner_phone || '',
          owner_email: selectedOwner.owner_email || '',
          owner_address: selectedOwner.owner_address || '',
          notes: selectedOwner.notes || '',
          // Keep current dates and transfer mode unchanged
          ownership_start_date: prev.ownership_start_date,
          ownership_end_date: prev.ownership_end_date,
          is_transfer: prev.is_transfer
        };
        
        console.log('Form data updated:', newData);
        return newData;
      });

      // Clear errors for filled fields
      setErrors(prev => ({
        ...prev,
        owner_name: '',
        owner_phone: '',
        owner_email: ''
      }));
      
      console.log('Template selection completed');
    } else {
      console.error('Owner not found for ID:', ownerId);
      console.error('Available owners:', availableOwners);
    }
  };

  /**
   * Clear template selection and reset form
   */
  const clearTemplate = () => {
    setSelectedTemplate('');
    resetForm();
  };

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
      notes: '',
      is_transfer: false
    });
    setErrors({});
  };

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: fieldValue
      };
      
      // Clear ownership_end_date when transfer mode is enabled
      if (name === 'is_transfer' && fieldValue === true) {
        newData.ownership_end_date = '';
      }
      
      return newData;
    });

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

    // Validate ownership end date for former owners (required field)
    if (editingOwner && !editingOwner.is_current_owner && !formData.ownership_end_date) {
      newErrors.ownership_end_date = 'Tanggal berakhir kepemilikan wajib diisi untuk mantan pemilik';
    }

    // Validate ownership end date for new owners (required field when not in transfer mode and there's a current owner)
    if (!editingOwner && !formData.is_transfer && hasCurrentOwner && !formData.ownership_end_date) {
      newErrors.ownership_end_date = 'Tanggal berakhir kepemilikan wajib diisi untuk menambah riwayat pemilik';
    }

    // Validate date range if end date is provided and not editing current owner and not in transfer mode
    if (formData.ownership_end_date && formData.ownership_start_date && 
        !(editingOwner && editingOwner.is_current_owner) && !formData.is_transfer && hasCurrentOwner) {
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
        // Prepare data for update - ensure end date is null for current owner
        const updateData = {
          ...formData,
          ownership_end_date: editingOwner.is_current_owner ? null : (formData.ownership_end_date || null)
        };
        
        // Update existing owner
        await updateGemstoneOwner(gemstoneId, editingOwner.id, updateData, getAuthHeader());
        dismissToast();
        showSuccess('Data pemilik berhasil diperbarui');
      } else {
        // Prepare data for add - ensure end date is null for transfer mode
        const addData = {
          ...formData,
          ownership_end_date: formData.is_transfer ? null : (formData.ownership_end_date || null)
        };
        
        // Add new owner with transfer option
        await addGemstoneOwner(gemstoneId, addData, getAuthHeader());
        dismissToast();
        showSuccess(formData.is_transfer ? 'Kepemilikan berhasil ditransfer' : 'Pemilik baru berhasil ditambahkan');
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
   * Format date from database to YYYY-MM-DD format for date input
   * @param {string} dateString - Date string from database
   * @returns {string} - Formatted date in YYYY-MM-DD format
   */
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // Handle both ISO strings and date-only strings
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    // Format to YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    resetForm();
    setSelectedTemplate('');
    onClose();
  };

  useEffect(() => {
    if (isOpen && editingOwner) {
      const formattedStartDate = formatDateForInput(editingOwner.ownership_start_date);
      const formattedEndDate = formatDateForInput(editingOwner.ownership_end_date);
      setFormData({
        owner_name: editingOwner.owner_name || '',
        owner_phone: editingOwner.owner_phone || '',
        owner_email: editingOwner.owner_email || '',
        owner_address: editingOwner.owner_address || '',
        ownership_start_date: formattedStartDate,
        ownership_end_date: editingOwner.is_current_owner ? '' : formattedEndDate, // Clear end date for current owner
        notes: editingOwner.notes || '',
        is_transfer: false // Reset transfer mode when editing
      });
    } else if (isOpen && !editingOwner) {
      resetForm();
      setSelectedTemplate(''); // Reset template selection
      fetchAvailableOwners();
      checkCurrentOwner();
    }
  }, [isOpen, editingOwner, gemstoneId]);

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
          {!editingOwner && availableOwners.length > 0 && (
            <div className={`border rounded-lg p-4 ${selectedTemplate ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <Copy className={`w-5 h-5 ${selectedTemplate ? 'text-green-600' : 'text-blue-600'}`} />
                <h4 className={`text-sm font-medium ${selectedTemplate ? 'text-green-900' : 'text-blue-900'}`}>
                  {selectedTemplate ? 'Template Dipilih' : 'Gunakan Data Pemilik Sebagai Template'}
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    disabled={isLoadingTemplates}
                    placeholder={isLoadingTemplates ? "Memuat data pemilik..." : "Pilih pemilik untuk digunakan sebagai template..."}
                    options={[
                      { value: '', label: isLoadingTemplates ? "Memuat data pemilik..." : "Pilih pemilik untuk digunakan sebagai template..." },
                      ...availableOwners.map((owner) => {
                        return {
                          value: owner.id,
                          label: `${owner.owner_name} - ${owner.owner_phone} (${owner.gemstone_name || 'Unknown Gemstone'})`
                        };
                      })
                    ]}
                  />
                </div>
                {selectedTemplate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearTemplate}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Hapus Template
                  </Button>
                )}
              </div>
              {selectedTemplate && (
                <p className="text-xs text-green-700 mt-2 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Template dipilih: Data akan mengisi form secara otomatis. Anda masih bisa mengubah data sebelum menyimpan.
                  {(() => {
                    const selectedOwner = availableOwners.find(owner => owner.id == selectedTemplate);
                    return selectedOwner ? ` (Dari: ${selectedOwner.gemstone_name || 'Unknown Gemstone'})` : '';
                  })()}
                </p>
              )}
            </div>
          )}

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
                className={`${errors.owner_name ? 'border-red-500' : ''} ${selectedTemplate && formData.owner_name ? 'border-green-300 bg-green-50' : ''}`}
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
                className={`${errors.owner_phone ? 'border-red-500' : ''} ${selectedTemplate && formData.owner_phone ? 'border-green-300 bg-green-50' : ''}`}
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
                className={`${errors.owner_email ? 'border-red-500' : ''} ${selectedTemplate && formData.owner_email ? 'border-green-300 bg-green-50' : ''}`}
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
            
            {/* Tanggal Berakhir Kepemilikan - Hidden for current owner, transfer mode, or first owner */}
            {!(editingOwner && editingOwner.is_current_owner) && !formData.is_transfer && hasCurrentOwner && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Berakhir Kepemilikan {(editingOwner && !editingOwner.is_current_owner) || (!editingOwner && !formData.is_transfer && hasCurrentOwner) ? '*' : ''}
                </label>
                <Input
                  name="ownership_end_date"
                  type="date"
                  value={formData.ownership_end_date || ''}
                  onChange={handleInputChange}
                  min={formData.ownership_start_date}
                  required={(editingOwner && !editingOwner.is_current_owner) || (!editingOwner && !formData.is_transfer && hasCurrentOwner)}
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

          {/* Info box for current owner */}
          {editingOwner && editingOwner.is_current_owner && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>
                  <strong>Pemilik Aktif:</strong> Tanggal berakhir kepemilikan tidak diperlukan karena ini adalah pemilik saat ini.
                </span>
              </p>
            </div>
          )}

          {/* Info box for transfer mode */}
          {!editingOwner && formData.is_transfer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>
                  <strong>Mode Transfer:</strong> Tanggal berakhir kepemilikan tidak diperlukan karena pemilik baru akan menjadi pemilik aktif.
                </span>
              </p>
            </div>
          )}

          {/* Info box for first owner */}
          {!editingOwner && !hasCurrentOwner && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>
                  <strong>Pemilik Pertama:</strong> Tanggal berakhir kepemilikan tidak diperlukan karena ini adalah pemilik pertama. Pemilik akan otomatis menjadi pemilik aktif.
                </span>
              </p>
            </div>
          )}
          
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
              className={`${selectedTemplate && formData.owner_address ? 'border-green-300 bg-green-50' : ''}`}
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
              className={`${selectedTemplate && formData.notes ? 'border-green-300 bg-green-50' : ''}`}
            />
          </div>

          {/* Transfer Ownership Checkbox - Only show when adding new owner and there's a current owner */}
          {!editingOwner && hasCurrentOwner && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="is_transfer"
                  name="is_transfer"
                  checked={formData.is_transfer}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="is_transfer" className="block text-sm font-medium text-blue-900 cursor-pointer">
                    Transfer Kepemilikan
                  </label>
                  <p className="text-xs text-blue-700 mt-1">
                    Centang jika pemilik baru ini akan menggantikan pemilik aktif saat ini.
                    Jika tidak dicentang, pemilik akan ditambahkan sebagai riwayat pemilik sebelumnya.
                  </p>
                </div>
              </div>
            </div>
          )}

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
