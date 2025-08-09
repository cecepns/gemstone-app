// ANCHOR: TransferOwnershipModal Component - Modal for transferring gemstone ownership
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addGemstoneOwner } from '../utils/api';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';
import { 
  UserPlus, 
  UserCheck, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  X,
  AlertCircle
} from 'lucide-react';
import { Button, Input, Textarea, Modal } from './ui';

/**
 * TransferOwnershipModal component - Transfer gemstone ownership to new owner
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close modal function
 * @param {Function} props.onSuccess - Success callback function
 * @param {string} props.gemstoneId - Gemstone ID
 * @param {string} props.gemstoneName - Gemstone name for display
 * @param {Object} props.currentOwner - Current owner data (optional)
 * @returns {React.ReactElement} - Rendered modal component
 */
const TransferOwnershipModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  gemstoneId, 
  gemstoneName, 
  currentOwner 
}) => {
  const { getAuthHeader } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    owner_address: '',
    ownership_start_date: '',
    notes: ''
  });

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
      notes: ''
    });
  };

  /**
   * Get current date in YYYY-MM-DD format for date input
   * @returns {string} - Current date in YYYY-MM-DD format
   */
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.owner_name.trim() || !formData.owner_phone.trim() || !formData.ownership_start_date) {
      showError('Nama pemilik, nomor telepon, dan tanggal transfer harus diisi');
      return;
    }

    try {
      showLoading('Memproses transfer kepemilikan...');

      // Add new owner with transfer flag
      await addGemstoneOwner(gemstoneId, {
        ...formData,
        is_transfer: true
      }, getAuthHeader());

      showSuccess('Kepemilikan berhasil ditransfer');
      
      resetForm();
      onClose();
      
      // Call success callback to refresh data
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error transferring ownership:', error);
      showError(error.message || 'Gagal memproses transfer kepemilikan');
    } finally {
      dismissToast();
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Transfer Kepemilikan
              </h2>
              <p className="text-sm text-gray-600">{gemstoneName}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Current Owner Info */}
        {currentOwner && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Pemilik Saat Ini</span>
            </div>
            <div className="text-sm text-blue-800">
              <p><strong>{currentOwner.owner_name}</strong></p>
              <p>{currentOwner.owner_phone}</p>
              {currentOwner.owner_email && <p>{currentOwner.owner_email}</p>}
            </div>
          </div>
        )}

        {/* Transfer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pemilik Baru *
              </label>
              <Input
                name="owner_name"
                value={formData.owner_name}
                onChange={handleInputChange}
                placeholder="Masukkan nama pemilik baru"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon *
              </label>
              <Input
                name="owner_phone"
                value={formData.owner_phone}
                onChange={handleInputChange}
                placeholder="Masukkan nomor telepon"
                required
              />
            </div>
            
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
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Transfer *
              </label>
              <Input
                name="ownership_start_date"
                type="date"
                value={formData.ownership_start_date}
                onChange={handleInputChange}
                max={getCurrentDate()}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <Textarea
              name="owner_address"
              value={formData.owner_address}
              onChange={handleInputChange}
              placeholder="Masukkan alamat pemilik baru (opsional)"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan Transfer
            </label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Masukkan catatan tentang transfer kepemilikan (opsional)"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Transfer Kepemilikan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TransferOwnershipModal;
