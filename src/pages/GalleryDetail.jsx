import { ArrowLeft, ChevronLeft, ChevronRight, Download, Calendar, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { Button, Card } from '../components/ui';
import { getGemstonePhotosPublic } from '../utils/api';

const GalleryDetail = () => {
  const { uniqueId, photoIndex } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get data from navigation state or fetch from API
  useEffect(() => {
    if (location.state?.photos) {
      setPhotos(location.state.photos);
      setCurrentIndex(parseInt(photoIndex) || 0);
    } else {
      // Fallback: fetch photos if no state
      fetchPhotos();
    }
  }, [location.state, photoIndex]);

  const fetchPhotos = async() => {
    try {
      setLoading(true);
      setError('');
      const response = await getGemstonePhotosPublic(uniqueId);
      setPhotos(response.data || []);
      setCurrentIndex(parseInt(photoIndex) || 0);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Gagal memuat foto');
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

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      navigate(`/verify/${uniqueId}/gallery/${newIndex}`, {
        state: { photos, currentIndex: newIndex, gemstoneId: uniqueId },
        replace: true,
      });
    }
  };

  const goToNext = () => {
    if (currentIndex < photos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      navigate(`/verify/${uniqueId}/gallery/${newIndex}`, {
        state: { photos, currentIndex: newIndex, gemstoneId: uniqueId },
        replace: true,
      });
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
    case 'ArrowLeft':
      goToPrevious();
      break;
    case 'ArrowRight':
      goToNext();
      break;
    case 'Escape':
      navigate(`/verify/${uniqueId}`);
      break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos.length]);

  const handleBack = () => {
    navigate(`/verify/${uniqueId}`);
  };

  const downloadImage = async() => {
    if (!photos[currentIndex]) {
      return;
    }

    try {
      const response = await fetch(photos[currentIndex].photo_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gemstone-photo-${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat foto...</p>
        </div>
      </div>
    );
  }

  if (error || photos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Gagal Memuat Foto</h3>
          <p className="text-gray-600 mb-6">{error || 'Tidak ada foto tersedia'}</p>
          <Button variant="primary" onClick={handleBack} fullWidth>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Verifikasi
          </Button>
        </Card>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Verifikasi
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Image Container */}
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="relative">
              <img
                src={currentPhoto.photo_url}
                alt={currentPhoto.caption || 'Foto proses gemstone'}
                className="w-full h-auto max-h-[70vh] object-contain"
              />

              {/* Navigation Arrows */}
              {currentIndex > 0 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200"
                  title="Foto Sebelumnya (←)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {currentIndex < photos.length - 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200"
                  title="Foto Selanjutnya (→)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Photo Info */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Photo Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Detail Foto</h2>

                {currentPhoto.caption && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Caption</h3>
                    <p className="text-gray-800">{currentPhoto.caption}</p>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(currentPhoto.created_at)}</span>
                </div>

                {currentPhoto.uploaded_by && (
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Upload oleh: {currentPhoto.uploaded_by}</span>
                  </div>
                )}
              </div>

              {/* Right Column - Navigation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Navigasi</h3>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Sebelumnya
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={goToNext}
                    disabled={currentIndex === photos.length - 1}
                    className="flex-1"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Gunakan tombol panah keyboard untuk navigasi cepat
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ← Sebelumnya | → Selanjutnya | ESC Kembali
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Thumbnail Navigation */}
          {photos.length > 1 && (
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Semua Foto</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentIndex
                        ? 'border-purple-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setCurrentIndex(index);
                      navigate(`/verify/${uniqueId}/gallery/${index}`, {
                        state: { photos, currentIndex: index, gemstoneId: uniqueId },
                        replace: true,
                      });
                    }}
                  >
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || `Foto ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryDetail;
