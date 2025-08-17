import React, { useState } from 'react';

import { useAuth } from '../context/useAuth';
import { updateGemstonePhoto } from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

import Button from './ui/Button';
import Modal from './ui/Modal';
import Textarea from './ui/Textarea';

const EditPhotoModal = ({ isOpen, onClose, gemstoneId, photo, onSuccess }) => {
  const { getAuthHeader } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [caption, setCaption] = useState(photo?.caption || '');

  const handleUpdate = async() => {
    if (!photo) {
      return;
    }

    try {
      setUpdating(true);
      const response = await updateGemstonePhoto(gemstoneId, photo.id, {
        caption: caption.trim() || null,
      }, getAuthHeader());

      // Close modal and trigger success callback
      onClose();
      if (onSuccess) {
        onSuccess(response.data.data);
      }

      showSuccess('Caption berhasil diperbarui');
    } catch (error) {
      console.error('Error updating caption:', error);
      showError('Gagal memperbarui caption');
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = () => {
    // Reset caption when closing
    setCaption(photo?.caption || '');
    onClose();
  };

  // Update caption when photo changes
  React.useEffect(() => {
    if (photo) {
      setCaption(photo.caption || '');
    }
  }, [photo]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Caption">
      <div className="space-y-4 p-4">
        <Textarea
          placeholder="Caption foto"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
        />
        <div className="flex space-x-2">
          <Button
            onClick={handleUpdate}
            disabled={updating}
            className="flex-1"
          >
            {updating ? 'Updating...' : 'Simpan'}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPhotoModal;
