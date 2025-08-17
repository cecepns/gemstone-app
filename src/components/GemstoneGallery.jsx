import React, { useState, useEffect } from 'react';

import { useAuth } from '../context/useAuth';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import Textarea from './ui/Textarea';

const GemstoneGallery = ({ gemstoneId, isOpen, onClose }) => {
  const { getAuthHeader } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Load photos when modal opens
  useEffect(() => {
    if (isOpen && gemstoneId) {
      loadPhotos();
    }
  }, [isOpen, gemstoneId]);

  const loadPhotos = async() => {
    try {
      setLoading(true);
      const response = await apiGet(`/gemstones/${gemstoneId}/photos`, { token: getAuthHeader() });
      setPhotos(response.data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
      showError('Gagal memuat foto');
    } finally {
      setLoading(false);
    }
  };

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

      const response = await apiPost(`/gemstones/${gemstoneId}/photos`, {
        data: formData,
        isFormData: true,
        token: getAuthHeader(),
      });

      setPhotos(prev => [response.data.data, ...prev]);
      setSelectedFile(null);
      setCaption('');
      showSuccess('Foto berhasil diupload');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showError('Gagal upload foto');
    } finally {
      setUploading(false);
    }
  };

  const handleEditCaption = async() => {
    if (!editingPhoto) {
      return;
    }

    try {
      const response = await apiPut(`/gemstones/${gemstoneId}/photos/${editingPhoto.id}`, {
        data: {
          caption: editCaption.trim() || null,
        },
        token: getAuthHeader(),
      });

      setPhotos(prev => prev.map(photo =>
        photo.id === editingPhoto.id ? response.data.data : photo,
      ));
      setShowEditModal(false);
      setEditingPhoto(null);
      setEditCaption('');
      showSuccess('Caption berhasil diperbarui');
    } catch (error) {
      console.error('Error updating caption:', error);
      showError('Gagal memperbarui caption');
    }
  };

  const handleDeletePhoto = async(photoId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
      return;
    }

    try {
      await apiDelete(`/gemstones/${gemstoneId}/photos/${photoId}`, { token: getAuthHeader() });
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      showSuccess('Foto berhasil dihapus');
    } catch (error) {
      console.error('Error deleting photo:', error);
      showError('Gagal menghapus foto');
    }
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setEditCaption(photo.caption || '');
    setShowEditModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Galeri Foto Gemstone" size="lg">
        <div className="space-y-4">
          {/* Upload Section */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="text-gray-600 mb-2">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Klik untuk memilih foto atau drag & drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WebP maksimal 5MB
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">File terpilih:</span>
                  <span className="text-sm text-gray-600">{selectedFile.name}</span>
                </div>
                <Textarea
                  placeholder="Caption foto (opsional)"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={2}
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? 'Uploading...' : 'Upload Foto'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setCaption('');
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Photos Grid */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              <p className="text-gray-600 mt-2">Memuat foto...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 mt-2">Belum ada foto</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="aspect-square">
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || 'Foto gemstone'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(photo)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                        title="Edit caption"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        title="Hapus foto"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Caption */}
                  {photo.caption && (
                    <div className="p-2 bg-white">
                      <p className="text-sm text-gray-700 line-clamp-2">{photo.caption}</p>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-2 bg-gray-50">
                    <p className="text-xs text-gray-500">
                      {formatDate(photo.created_at)}
                    </p>
                    <p className="text-xs text-gray-400">
                      oleh {photo.uploaded_by}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Caption Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Caption">
        <div className="space-y-4">
          <Textarea
            placeholder="Caption foto"
            value={editCaption}
            onChange={(e) => setEditCaption(e.target.value)}
            rows={3}
          />
          <div className="flex space-x-2">
            <Button onClick={handleEditCaption} className="flex-1">
              Simpan
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Batal
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GemstoneGallery;
