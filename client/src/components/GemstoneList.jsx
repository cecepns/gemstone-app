// ANCHOR: GemstoneList Component - Display and manage gemstone data
import { useState, useEffect } from 'react';
import { Gem, RefreshCw, Search, Smartphone, Edit, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GemstoneList = () => {
  // Get auth context for token
  const { getAuthHeader } = useAuth();

  // Component state
  const [gemstones, setGemstones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  /**
   * Fetch gemstones from API
   */
  const fetchGemstones = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get auth headers
      const authHeaders = getAuthHeader();

      // Make GET request to fetch gemstones
      const response = await fetch('http://localhost:5000/api/gemstones', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setGemstones(result.data || []);
      } else {
        setError(result.message || 'Failed to load gemstone data');
      }
    } catch (error) {
      console.error('Error fetching gemstones:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Cannot connect to server. Please ensure backend is running.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchGemstones();
  }, []);

  /**
   * Filter and sort gemstones
   */
  const filteredAndSortedGemstones = gemstones
    .filter(gemstone => 
      gemstone.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gemstone.unique_id_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gemstone.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gemstone.origin?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle different data types
      if (sortBy === 'weight_carat') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Handle refresh data
   */
  const handleRefresh = () => {
    fetchGemstones();
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handle sort change
   */
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  /**
   * Copy ID to clipboard
   */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard:', text);
    });
  };

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gem className="w-5 h-5 text-purple-600" />
            </div>
            Gemstone List
          </h3>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gemstone data...</p>
        </div>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gem className="w-5 h-5 text-purple-600" />
            </div>
            Gemstone List
          </h3>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition duration-200 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Gem className="w-5 h-5 text-purple-600" />
          </div>
          Gemstone List
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {filteredAndSortedGemstones.length} items
          </span>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search by name, ID, color, or origin..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
          />
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-600">Sort by:</span>
          {[
            { field: 'created_at', label: 'Date' },
            { field: 'name', label: 'Name' },
            { field: 'weight_carat', label: 'Weight' },
            { field: 'color', label: 'Color' }
          ].map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSortChange(field)}
              className={`px-4 py-2 text-sm rounded-xl transition duration-200 ${
                sortBy === field
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
              {sortBy === field && (
                <span className="ml-2">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Gemstone Cards */}
      {filteredAndSortedGemstones.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gem className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Gemstones Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No gemstones match your search criteria.' : 'No gemstones have been added yet.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition duration-200"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {filteredAndSortedGemstones.map((gemstone) => (
            <div key={gemstone.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition duration-200 bg-white/50 backdrop-blur-sm">
              <div className="flex items-start space-x-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  {gemstone.photo_url ? (
                    <img
                      src={gemstone.photo_url}
                      alt={gemstone.name}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                      <Gem className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 truncate">
                        {gemstone.name || 'Unnamed Gemstone'}
                      </h4>
                      <div className="flex items-center space-x-3 mt-2">
                        <span 
                          className="text-sm text-purple-600 font-mono cursor-pointer hover:bg-purple-50 px-3 py-1 rounded-lg transition duration-200"
                          onClick={() => copyToClipboard(gemstone.unique_id_number)}
                          title="Click to copy"
                        >
                          {gemstone.unique_id_number}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(gemstone.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    {gemstone.weight_carat && (
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <span className="ml-2 font-medium">{gemstone.weight_carat} carat</span>
                      </div>
                    )}
                    {gemstone.color && (
                      <div>
                        <span className="text-gray-500">Color:</span>
                        <span className="ml-2 font-medium">{gemstone.color}</span>
                      </div>
                    )}
                    {gemstone.dimensions_mm && (
                      <div>
                        <span className="text-gray-500">Dimensions:</span>
                        <span className="ml-2 font-medium">{gemstone.dimensions_mm} mm</span>
                      </div>
                    )}
                    {gemstone.origin && (
                      <div>
                        <span className="text-gray-500">Origin:</span>
                        <span className="ml-2 font-medium">{gemstone.origin}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {gemstone.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {gemstone.description}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center space-x-3">
                    <button 
                      onClick={() => window.open(`/verify/${gemstone.unique_id_number}`, '_blank')}
                      className="text-xs bg-green-100 text-green-800 px-3 py-2 rounded-lg hover:bg-green-200 transition duration-200 flex items-center gap-1"
                    >
                      <Search className="w-3 h-3" />
                      Verify
                    </button>
                    {gemstone.qr_code_data_url && (
                      <button className="text-xs bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition duration-200 flex items-center gap-1">
                        <Smartphone className="w-3 h-3" />
                        QR Code
                      </button>
                    )}
                    <button className="text-xs bg-gray-100 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-1">
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GemstoneList;