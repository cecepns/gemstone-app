import React, { useState, useEffect } from 'react';

import { useAuth } from '../context/useAuth';
import { getGemstonePhotos, deleteGemstonePhoto } from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

import AddPhotoModal from './AddPhotoModal';
import DeletePhotoModal from './DeletePhotoModal';
import EditPhotoModal from './EditPhotoModal';
import Button from './ui/Button';

const GemstoneGallerySection = ({ gemstoneId, showUploadModal, onCloseUploadModal, onOpenUploadModal, onRefresh }) => {
  const { getAuthHeader } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load photos when component mounts
  useEffect(() => {
    if (gemstoneId) {
      loadPhotos();
    }
  }, [gemstoneId]);

  const loadPhotos = async() => {
    try {
      setLoading(true);
      const response = await getGemstonePhotos(gemstoneId, getAuthHeader());
      setPhotos(response.data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
      showError('Gagal memuat foto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = (updatedPhoto) => {
    setPhotos(prev => prev.map(photo =>
      photo.id === updatedPhoto.id ? updatedPhoto : photo,
    ));
  };

  const openDeleteModal = (photo) => {
    setDeletingPhoto(photo);
    setShowDeleteModal(true);
  };

  const handleDeletePhoto = async() => {
    if (!deletingPhoto) {
      return;
    }

    try {
      await deleteGemstonePhoto(gemstoneId, deletingPhoto.id, getAuthHeader());
      setPhotos(prev => prev.filter(photo => photo.id !== deletingPhoto.id));
      showSuccess('Foto berhasil dihapus');
      setShowDeleteModal(false);
      setDeletingPhoto(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
      showError('Gagal menghapus foto');
    }
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
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
      <div className="space-y-4" data-gallery-section>
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
            <Button onClick={onOpenUploadModal} className="mt-3">
              Tambah Foto Pertama
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || 'Foto gemstone'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-80">
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
                      onClick={() => openDeleteModal(photo)}
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

      {/* Add Photo Modal */}
      <AddPhotoModal
        isOpen={showUploadModal}
        onClose={onCloseUploadModal}
        gemstoneId={gemstoneId}
        onSuccess={() => {
          loadPhotos();
          if (onRefresh) {
            onRefresh();
          }
        }}
      />

      {/* Edit Photo Modal */}
      <EditPhotoModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        gemstoneId={gemstoneId}
        photo={editingPhoto}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Photo Modal */}
      <DeletePhotoModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingPhoto(null);
        }}
        onConfirm={handleDeletePhoto}
        photoName={deletingPhoto?.caption || 'Foto'}
      />
    </>
  );
};

export default GemstoneGallerySection;
