import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getGemstonePhotosPublic } from '../utils/api';

const PublicGemstoneGallery = ({ uniqueId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load photos when component mounts
  useEffect(() => {
    if (uniqueId) {
      loadPhotos();
    }
  }, [uniqueId]);

  const loadPhotos = async() => {
    try {
      setLoading(true);
      setError('');
      const response = await getGemstonePhotosPublic(uniqueId);
      setPhotos(response.data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
      setError('Gagal memuat foto proses');
    } finally {
      setLoading(false);
    }
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

  const handlePhotoClick = (photoIndex) => {
    navigate(`/verify/${uniqueId}/gallery/${photoIndex}`, {
      state: {
        photos,
        currentIndex: photoIndex,
        gemstoneId: uniqueId,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Photos Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="text-gray-600 mt-2">Memuat foto proses...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 mt-2">Belum ada foto proses tersedia</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => handlePhotoClick(index)}
            >
              <div className="aspect-square">
                <img
                  src={photo.photo_url}
                  alt={photo.caption || 'Foto proses gemstone'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* View indicator overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white bg-opacity-90 rounded-full p-2">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>

              {/* Caption */}
              {photo.caption && (
                <div className="p-3 bg-white">
                  <p className="text-sm text-gray-700 line-clamp-2">{photo.caption}</p>
                </div>
              )}

              {/* Info */}
              <div className="p-3 bg-gray-50">
                <p className="text-xs text-gray-500">
                  {formatDate(photo.created_at)}
                </p>
                {photo.uploaded_by && (
                  <p className="text-xs text-gray-400">
                    oleh {photo.uploaded_by}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicGemstoneGallery;
