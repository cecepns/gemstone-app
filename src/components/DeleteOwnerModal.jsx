// ANCHOR: DeleteOwnerModal Component - Modal for confirming owner deletion
import { useAuth } from '../context/useAuth';
import { deleteGemstoneOwner } from '../utils/api';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';
import { 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { Button, Modal } from './ui';

/**
 * DeleteOwnerModal component - Modal for confirming owner deletion
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close modal function
 * @param {Function} props.onSuccess - Success callback function
 * @param {string} props.gemstoneId - Gemstone ID
 * @param {Object} props.owner - Owner data to delete
 * @returns {React.ReactElement} - Rendered modal component
 */
const DeleteOwnerModal = ({ isOpen, onClose, onSuccess, gemstoneId, owner }) => {
  const { getAuthHeader } = useAuth();

  /**
   * Handle owner deletion
   */
  const handleDelete = async () => {
    if (!owner) return;

    try {
      showLoading('Menghapus data pemilik...');

      await deleteGemstoneOwner(gemstoneId, owner.id, getAuthHeader());
      showSuccess('Data pemilik berhasil dihapus');
      
      onSuccess(); // Call success callback
      onClose(); // Close modal
    } catch (error) {
      console.error('Error deleting owner:', error);
      showError(error.message || 'Gagal menghapus data pemilik');
    } finally {
      dismissToast();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Konfirmasi Hapus
          </h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus data pemilik <strong>{owner?.owner_name}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteOwnerModal;
