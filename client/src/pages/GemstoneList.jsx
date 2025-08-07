// ANCHOR: GemstoneList Component - Display and manage gemstone data
import { useState, useEffect } from 'react';
import { Gem, RefreshCw, Search, Smartphone, Edit, CheckCircle, AlertCircle, FileText, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getGemstones, deleteGemstone } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';

const GemstoneList = () => {
  // Get auth context for token
  const { getAuthHeader } = useAuth();
  const navigate = useNavigate();

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

      // Use API utility to fetch gemstones
      const result = await getGemstones({ 
        authHeader: getAuthHeader() 
      });

      setGemstones(result.data || []);
    } catch (error) {
      console.error('Error fetching gemstones:', error);
      setError(error.message || 'Failed to load gemstone data');
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
   * Handle add gemstone navigation
   */
  const handleAddGemstone = () => {
    navigate('/admin/gemstones/add');
  };

  /**
   * Handle delete gemstone
   * @param {string} id - Gemstone ID
   * @param {string} name - Gemstone name for confirmation
   */
  const handleDeleteGemstone = async (id, name) => {
    const confirmMessage = `Are you sure you want to delete "${name || 'this gemstone'}"? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteGemstone(id, getAuthHeader());
        
        // Refresh the gemstone list after successful deletion
        await fetchGemstones();
        
        // Could add a success notification here
        console.log('Gemstone deleted successfully');
      } catch (error) {
        console.error('Error deleting gemstone:', error);
        setError(error.message || 'Failed to delete gemstone');
      }
    }
  };

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gem className="w-5 h-5 text-purple-600" />
            </div>
            Gemstone
          </h3>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gemstone data...</p>
        </div>
      </Card>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
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
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
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
          <Button
            variant="success"
            size="md"
            onClick={handleAddGemstone}
            className="p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            title="Add new gemstone"
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleRefresh}
            className="p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div>
          <Input
            type="text"
            placeholder="Search by name, ID, color, or origin..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="lg"
            className="rounded-xl bg-white/50 backdrop-blur-sm"
            leftIcon={<Search className="w-5 h-5" />}
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
            <Button
              key={field}
              variant={sortBy === field ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleSortChange(field)}
              className="rounded-xl"
            >
              {label}
              {sortBy === field && (
                <span className="ml-2">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Gemstone Table */}
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
            <Button
              variant="primary"
              onClick={() => setSearchTerm('')}
              className="rounded-xl"
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
                         {/* Table Header */}
             <thead className="bg-purple-50 border-b border-purple-200">
               <tr>
                 <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">
                   Image
                 </th>
                 <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">
                   ID Number
                 </th>
                 <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">
                   Name
                 </th>
                 <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">
                   Date Added
                 </th>
                 <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">
                   Actions
                 </th>
               </tr>
             </thead>
            
                         {/* Table Body */}
             <tbody className="divide-y divide-gray-200">
               {filteredAndSortedGemstones.map((gemstone) => (
                 <tr key={gemstone.id} className="hover:bg-purple-50/50 transition duration-200">
                   {/* Image Column */}
                   <td className="px-6 py-4">
                     <div className="flex-shrink-0">
                       {gemstone.photo_url ? (
                         <img
                           src={gemstone.photo_url}
                           alt={gemstone.name}
                           className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                         />
                       ) : (
                         <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                           <Gem className="w-6 h-6 text-gray-400" />
                         </div>
                       )}
                     </div>
                   </td>

                   {/* ID Number Column */}
                   <td className="px-6 py-4">
                     <span 
                       className="text-sm text-purple-600 font-mono cursor-pointer hover:bg-purple-50 px-2 py-1 rounded transition duration-200"
                       onClick={() => copyToClipboard(gemstone.unique_id_number)}
                       title="Click to copy"
                     >
                       {gemstone.unique_id_number}
                     </span>
                   </td>

                   {/* Name Column */}
                   <td className="px-6 py-4">
                     <div>
                       <div className="text-sm font-semibold text-gray-900">
                         {gemstone.name || 'Unnamed Gemstone'}
                       </div>
                     </div>
                   </td>

                   {/* Date Column */}
                   <td className="px-6 py-4">
                     <div className="text-sm text-gray-900">
                       {formatDate(gemstone.created_at)}
                     </div>
                   </td>

                   {/* Actions Column */}
                   <td className="px-6 py-4">
                     <div className="flex items-center space-x-2">
                       <Button
                         variant="secondary"
                         size="sm"
                         className="text-xs px-2 py-1"
                         title="Edit gemstone"
                       >
                         <Edit className="w-3 h-3 mr-1" />
                         Edit
                       </Button>
                       <Button
                         variant="primary"
                         size="sm"
                         onClick={() => navigate(`/admin/gemstones/${gemstone.id}`)}
                         className="text-xs px-2 py-1"
                         title="View gemstone details"
                       >
                         <Search className="w-3 h-3 mr-1" />
                         Detail
                       </Button>
                       <Button
                         variant="danger"
                         size="sm"
                         onClick={() => handleDeleteGemstone(gemstone.id, gemstone.name)}
                         className="text-xs px-2 py-1"
                         title="Delete gemstone"
                       >
                         <AlertCircle className="w-3 h-3 mr-1" />
                         Delete
                       </Button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default GemstoneList;