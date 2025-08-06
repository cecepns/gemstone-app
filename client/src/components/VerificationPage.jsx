// ANCHOR: VerificationPage Component - Display gemstone verification results
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const VerificationPage = () => {
  const { id } = useParams();
  const [gemstone, setGemstone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gemstone data when component mounts
  useEffect(() => {
    if (id) {
      fetchGemstoneData(id);
    }
  }, [id]);

  /**
   * Fetch gemstone data from API using axios
   * @param {string} uniqueId - Unique gemstone ID
   */
  const fetchGemstoneData = async (uniqueId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Make API request using axios
      const response = await axios.get(`http://localhost:5000/api/gemstones/${uniqueId}`);
      
      // If successful, set gemstone data
      setGemstone(response.data.data);
      
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 404) {
          setError('Certificate not found');
        } else {
          setError(err.response.data.message || 'Failed to verify certificate');
        }
      } else if (err.request) {
        // Network error - no response received
        setError('Cannot connect to server. Please ensure backend is running.');
      } else {
        // Other error
        setError('An unknown error occurred');
      }
      
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Back to Home */}
            <Link 
              to="/" 
              className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition duration-200"
            >
              ← Back to Home
            </Link>

            {/* Loading Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading...</h2>
                <p className="text-gray-600 mb-4">Verifying gemstone certificate...</p>
                
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="text-sm text-purple-800">
                    <strong>ID being verified:</strong> {id}
                  </p>
                </div>
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-100 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Back to Home */}
            <Link 
              to="/" 
              className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition duration-200"
            >
              ← Back to Home
            </Link>

            {/* Error Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Verification Failed
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>Searched ID:</strong> {id}
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => fetchGemstoneData(id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Try Again
                </button>
                <Link 
                  to="/"
                  className="block w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition duration-200"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - Display gemstone data
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back to Home */}
          <Link 
            to="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition duration-200"
          >
            ← Back to Home
          </Link>

          {/* Verification Success Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-green-600 mb-2 font-display">
                Certificate Verified
              </h1>
              <p className="text-gray-600 leading-relaxed">
                This gemstone has been verified and registered in our database
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Verified on: {new Date(gemstone.verification_timestamp).toLocaleString('en-US')}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Gemstone Image */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">📷</span>
                </div>
                Gemstone Photo
              </h2>
              {gemstone.photo_url ? (
                <div className="space-y-4">
                  <img 
                    src={gemstone.photo_url} 
                    alt={gemstone.name || 'Gemstone'}
                    className="w-full h-64 object-cover rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex-col items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-gray-500">Failed to load image</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-500">Photo not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Gemstone Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">💎</span>
                </div>
                Gemstone Details
              </h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Unique ID</label>
                  <p className="text-lg text-purple-600 font-mono bg-purple-50 px-4 py-3 rounded-xl">
                    {gemstone.unique_id_number}
                  </p>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Gemstone Name</label>
                  <p className="text-lg text-gray-900 font-semibold">
                    {gemstone.name || 'Not available'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Weight</label>
                    <p className="text-gray-900">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Dimensions</label>
                    <p className="text-gray-900">
                      {gemstone.dimensions_mm ? (
                        <span className="inline-flex items-center">
                          <span className="font-semibold">{gemstone.dimensions_mm}</span>
                          <span className="text-sm text-gray-500 ml-1">mm</span>
                        </span>
                      ) : (
                        'Not available'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Color</label>
                    <p className="text-gray-900 font-medium">
                      {gemstone.color || 'Not available'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Origin</label>
                    <p className="text-gray-900 font-medium">
                      {gemstone.origin || 'Not available'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Treatment</label>
                  <p className="text-gray-900">
                    {gemstone.treatment || 'Not available'}
                  </p>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Registration Date</label>
                  <p className="text-gray-900">
                    {new Date(gemstone.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {gemstone.description && (
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-lg">📝</span>
                  </div>
                  Description
                </h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {gemstone.description}
                  </p>
                </div>
              </div>
            )}

            {/* QR Code */}
            {gemstone.qr_code_data_url && (
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-lg">📱</span>
                  </div>
                  Certificate QR Code
                </h2>
                <div className="text-center">
                  <div className="inline-block bg-white p-6 rounded-xl shadow-lg border">
                    <img 
                      src={gemstone.qr_code_data_url} 
                      alt="QR Code"
                      className="h-32 w-32 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Scan this QR code for quick verification in the future
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    QR code contains link: /verify/{gemstone.unique_id_number}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;