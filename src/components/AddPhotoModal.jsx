import React, { useState } from 'react';

import { useAuth } from '../context/useAuth';
import { uploadGemstonePhoto } from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

import Button from './ui/Button';
import Modal from './ui/Modal';
import Textarea from './ui/Textarea';

const AddPhotoModal = ({ isOpen, onClose, gemstoneId, onSuccess }) => {
  const { getAuthHeader } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showError('Format file tidak didukung. Gunakan JPG, PNG, atau WebP');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showError('Ukuran file terlalu besar. Maksimal 5MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async() => {
    if (!selectedFile) {
      showError('Pilih file foto terlebih dahulu');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', selectedFile);
      if (caption.trim()) {
        formData.append('caption', caption.trim());
      }

      await uploadGemstonePhoto(gemstoneId, formData, getAuthHeader());

      // Reset form
      setSelectedFile(null);
      setCaption('');

      // Close modal and trigger success callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }

      showSuccess('Foto berhasil diupload');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showError('Gagal upload foto');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setSelectedFile(null);
    setCaption('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Foto">
      <div className="space-y-4 p-4">
        {/* File Input */}
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload-modal"
          />
          <label htmlFor="photo-upload-modal" className="cursor-pointer">
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm text-gray-600">Pilih foto</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (max 5MB)</p>
            </div>
          </label>
        </div>

        {/* File Info & Caption */}
        {selectedFile && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">File:</span> {selectedFile.name}
            </div>

            {/* Image Preview */}
            <div className="relative">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>

            <Textarea
              placeholder="Caption foto (opsional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="flex-1"
          >
            {uploading ? 'Uploading...' : 'Upload'}
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

export default AddPhotoModal;
