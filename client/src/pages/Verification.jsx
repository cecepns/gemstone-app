// ANCHOR: VerificationPage Component - Display gemstone verification results
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyGemstone } from '../utils/api';
import { Card } from '../components/ui';

import { 
  Gem, 
  ArrowLeft, 
  AlertCircle, 
  FileText,
  Calendar,
  Weight,
  Palette,
  Ruler,
  MapPin,
  Settings,
  IdCard
} from 'lucide-react';

const Verification = () => {
  const { id } = useParams();
  const [gemstone, setGemstone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  // Fetch gemstone data when component mounts
  useEffect(() => {
    if (id) {
      fetchGemstoneData(id);
    }
  }, [id]);

  /**
   * Fetch gemstone data from API
   * @param {string} uniqueId - Unique gemstone ID
   */
  const fetchGemstoneData = async (uniqueId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use API utility to verify gemstone
      const result = await verifyGemstone(uniqueId);
      
      // If successful, set gemstone data
      setGemstone(result.data);
      
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'Gagal memverifikasi sertifikat');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };  

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Back to Home */}
          <Link 
            to="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Loading Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Memuat...</h2>
              <p className="text-gray-600 mb-4">Memverifikasi sertifikat batu mulia...</p>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-sm text-purple-800">
                  <strong>ID yang diverifikasi:</strong> {id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Back to Home */}
          <Link 
            to="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Error Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Verifikasi Gagal
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>ID yang dicari:</strong> {id}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Success state - Display gemstone data
  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Gemstone image and QR code */}
            <div className="space-y-6">
              {/* Gemstone image */}
              <div>
                {gemstone.photo_url ? (
                  <div className="relative">
                    <img
                      src={gemstone.photo_url}
                      alt={gemstone.name || 'Gemstone'}
                      className="w-full aspect-square object-cover rounded-xl border border-gray-200 shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Gem className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Tidak ada gambar tersedia</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Gemstone details */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                {gemstone.name || 'Batu Mulia Tanpa Nama'}
              </h3>

              {/* Unique ID */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                  <IdCard className="w-4 h-4" />
                  Nomor ID Unik
                </label>
                <p className="text-lg text-purple-600 font-mono bg-purple-50 px-4 py-3 rounded-xl border border-purple-200">
                  {gemstone.unique_id_number}
                </p>
              </div>

              {/* Description */}
              {gemstone.description && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Deskripsi
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    {gemstone.description}
                  </p>
                </div>
              )}

              {/* Specifications grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weight */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Weight className="w-4 h-4" />
                    Berat
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    {gemstone.weight_carat ? (
                      <span className="inline-flex items-center">
                        <span className="font-semibold">{gemstone.weight_carat}</span>
                      </span>
                    ) : (
                      'Tidak tersedia'
                    )}
                  </p>
                </div>

                {/* Dimensions */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Dimensi
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    {gemstone.dimensions_mm || 'Tidak tersedia'}
                  </p>
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Warna
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                                        {gemstone.color || 'Tidak tersedia'}
                  </p>
                </div>

                {/* Origin */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Asal
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                                        {gemstone.origin || 'Tidak tersedia'}
                  </p>
                </div>
              </div>

              {/* Treatment */}
              {gemstone.treatment && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Perawatan
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    {gemstone.treatment}
                  </p>
                </div>
              )}

              {/* Created date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Ditambahkan
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  {formatDate(gemstone.created_at)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Verification;