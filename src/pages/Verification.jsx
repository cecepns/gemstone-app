// ANCHOR: VerificationPage Component - Display gemstone verification results
import {
  ArrowLeft,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import PublicGemstoneGallery from '../components/PublicGemstoneGallery';
import GemstoneImageSection from '../components/shared/GemstoneImageSection';
import GemstoneLevelCard from '../components/shared/GemstoneLevelCard';
import GemstoneSpecifications from '../components/shared/GemstoneSpecifications';
import OwnerHistoryTable from '../components/shared/OwnerHistoryTable';
import { Card } from '../components/ui';
import { verifyGemstone, getGemstoneOwnersPublic } from '../utils/api';

const Verification = () => {
  const { id } = useParams();
  const [gemstone, setGemstone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  // Owner history state
  const [owners, setOwners] = useState([]);
  const [isLoadingOwners, setIsLoadingOwners] = useState(false);
  const [ownersError, setOwnersError] = useState('');

  // Fetch gemstone data when component mounts
  useEffect(() => {
    if (id) {
      fetchGemstoneData(id);
      fetchOwnersData(id);
    }
  }, [id]);

  /**
   * Fetch gemstone data from API
   * @param {string} uniqueId - Unique gemstone ID
   */
  const fetchGemstoneData = async(uniqueId) => {
    try {
      setLoading(true);
      setError(null);

      // Use API utility to verify gemstone
      const result = await verifyGemstone(uniqueId);

      // If successful, set gemstone data
      setGemstone(result.data);

    } catch (error) {
      setError(error.message || 'Gagal memverifikasi sertifikat');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch owners history from API
   * @param {string} uniqueId - Unique gemstone ID
   */
  const fetchOwnersData = async(uniqueId) => {
    try {
      setIsLoadingOwners(true);
      setOwnersError('');

      const result = await getGemstoneOwnersPublic(uniqueId);
      setOwners(result.data);
    } catch (error) {
      setOwnersError(error.message || 'Gagal memuat riwayat pemilik');
    } finally {
      setIsLoadingOwners(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Back to Home */}
          <Link
            to="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4 sm:mb-6 transition duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Loading Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-purple-600 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Memuat...</h2>
              <p className="text-gray-600 mb-4">Memverifikasi sertifikat batu mulia...</p>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 sm:p-4">
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Back to Home */}
          <Link
            to="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4 sm:mb-6 transition duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Error Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
              Verifikasi Gagal
            </h1>
            <p className="text-gray-600 mb-4 sm:mb-6">{error}</p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4 sm:mb-6 transition duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left column - Gemstone image */}
            <GemstoneImageSection
              gemstone={gemstone}
              options={{ showQRCode: false }}
            />

            {/* Right column - Gemstone details */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-3">
                {gemstone.name || 'Batu Mulia Tanpa Nama'}
              </h3>

              <GemstoneSpecifications
                gemstone={gemstone}
                options={{
                  showUniqueId: true,
                  showDescription: true,
                  showTreatment: true,
                  showCreatedDate: true,
                  useEnglishDate: true,
                }}
              />
            </div>
          </div>
        </Card>

        {/* Level Batu Mulia Section */}
        <GemstoneLevelCard
          gemstone={gemstone}
          className="bg-white/80 backdrop-blur-sm border-gray-100 mt-4 sm:mt-6"
        />

        {/* Owner History Section */}
        <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100 mt-4 sm:mt-6 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Riwayat Kepemilikan Batu Mulia
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">{gemstone.name}</p>
            </div>
          </div>

          {/* Owner History Table */}
          <OwnerHistoryTable
            owners={owners}
            loading={isLoadingOwners}
            error={ownersError}
            options={{
              showActions: false,
              useEnglishDate: true,
            }}
            className="mt-4"
          />
        </Card>

        {/* Gallery Section */}
        <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100 mt-4 sm:mt-6 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Galeri Foto Proses Batu Mulia
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">{gemstone.name}</p>
            </div>
          </div>

          {/* Gallery Content */}
          <PublicGemstoneGallery uniqueId={id} />
        </Card>
      </div>
    </div>
  );
};

export default Verification;
