// ANCHOR: GemstoneDetail Component - Display detailed gemstone information for admin
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGemstoneDetail, deleteGemstone } from '../utils/api';
import { 
  Gem, 
  ArrowLeft, 
  Printer, 
  Edit, 
  Trash2, 
  AlertCircle, 
  Loader2,
  FileText,
  Calendar,
  Weight,
  Palette,
  MapPin,
  Settings
} from 'lucide-react';
import { Button, Card } from '../components/ui';

/**
 * GemstoneDetail component - Display detailed gemstone information
 * Shows all gemstone details, QR code, and admin action buttons
 * 
 * @returns {React.ReactElement} - Rendered gemstone detail page
 */
const GemstoneDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();

  // Component state
  const [gemstone, setGemstone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch gemstone details from API
   */
  const fetchGemstoneDetail = async () => {
    try {
      setIsLoading(true);
      setError('');

      const result = await getGemstoneDetail(id, getAuthHeader());

      setGemstone(result.data);
    } catch (error) {
      console.error('Error fetching gemstone detail:', error);
      setError(error.message || 'Failed to load gemstone details');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchGemstoneDetail();
    }
  }, [id]);

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

  /**
   * Handle print action
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Handle edit action
   */
  const handleEdit = () => {
    navigate(`/admin/gemstones/${id}/edit`);
  };

  /**
   * Handle delete action
   */
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this gemstone? This action cannot be undone.')) {
      try {
        await deleteGemstone(id, getAuthHeader());
        navigate('/admin/gemstones');
      } catch (error) {
        console.error('Error deleting gemstone:', error);
        setError(error.message || 'An error occurred while deleting the gemstone');
      }
    }
  };

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    navigate('/admin/gemstones');
  };

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gemstone details...</p>
        </div>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Gemstone</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            variant="primary"
            onClick={handleBack}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  /**
   * No gemstone found
   */
  if (!gemstone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gem className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Gemstone Not Found</h3>
          <p className="text-gray-600 mb-6">The requested gemstone could not be found.</p>
          <Button
            variant="primary"
            onClick={handleBack}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and action buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={handleBack}
          className="rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>

        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={handlePrint}
            className="rounded-xl"
            title="Print gemstone details"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            variant="primary"
            onClick={handleEdit}
            className="rounded-xl"
            title="Edit gemstone"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            className="rounded-xl"
            title="Delete gemstone"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main content card */}
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
                    <p className="text-gray-500">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                QR Code
              </h3>
              {gemstone.qr_code_data_url ? (
                <div className="flex justify-center p-12">
                  <img
                    src={gemstone.qr_code_data_url}
                    alt="QR Code"
                    className="w-48 h-48 border border-gray-200 rounded-xl shadow-lg"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center mx-auto">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No QR code</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Gemstone details */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              {gemstone.name || 'Unnamed Gemstone'}
            </h3>

            {/* Unique ID */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Unique ID Number
              </label>
              <p className="text-lg text-purple-600 font-mono bg-purple-50 px-4 py-3 rounded-xl border border-purple-200">
                {gemstone.unique_id_number}
              </p>
            </div>

            {/* Description */}
            {gemstone.description && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500">Description</label>
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
                  Weight
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  {gemstone.weight_carat ? (
                    <span className="inline-flex items-center">
                      <span className="font-semibold">{gemstone.weight_carat}</span>
                      <span className="text-sm text-gray-500 ml-1">carat</span>
                    </span>
                  ) : (
                    'Not available'
                  )}
                </p>
              </div>

              {/* Dimensions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500">Dimensions</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  {gemstone.dimensions_mm || 'Not available'}
                </p>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  {gemstone.color || 'Not available'}
                </p>
              </div>

              {/* Origin */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Origin
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  {gemstone.origin || 'Not available'}
                </p>
              </div>
            </div>

            {/* Treatment */}
            {gemstone.treatment && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Treatment
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
                Date Added
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                {formatDate(gemstone.created_at)}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GemstoneDetail; 