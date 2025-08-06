// ANCHOR: AddGemstoneForm Component - Complete gemstone creation form with file upload
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AddGemstoneForm = () => {
  // Get auth context for token
  const { getAuthHeader } = useAuth();

  // Form state management
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight_carat: '',
    dimensions_mm: '',
    color: '',
    treatment: '',
    origin: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear notification when user starts typing
    if (notification.message) {
      setNotification({ type: '', message: '' });
    }
  };

  /**
   * Handle file selection and preview
   * @param {Event} e - File input change event
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setNotification({
          type: 'error',
          message: 'Only image files are allowed (JPG, PNG, GIF)'
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setNotification({
          type: 'error',
          message: 'File size must be less than 5MB'
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  /**
   * Clear file selection
   */
  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    // Reset file input
    const fileInput = document.getElementById('gemstoneImage');
    if (fileInput) fileInput.value = '';
  };

  /**
   * Validate form data
   * @returns {boolean} - True if form is valid
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      setNotification({
        type: 'error',
        message: 'Gemstone name is required'
      });
      return false;
    }
    
    if (formData.weight_carat && isNaN(parseFloat(formData.weight_carat))) {
      setNotification({
        type: 'error',
        message: 'Weight must be a number'
      });
      return false;
    }
    
    return true;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setNotification({ type: '', message: '' });

    try {
      // Create FormData object
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append file if selected
      if (selectedFile) {
        submitData.append('gemstoneImage', selectedFile);
      }

      // Get auth headers
      const authHeaders = getAuthHeader();

      // Make POST request to create gemstone
      const response = await fetch('http://localhost:5000/api/gemstones', {
        method: 'POST',
        headers: {
          ...authHeaders
          // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        body: submitData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success notification
        setNotification({
          type: 'success',
          message: `Gemstone "${formData.name}" successfully added with ID: ${result.data.unique_id_number}`
        });
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          weight_carat: '',
          dimensions_mm: '',
          color: '',
          treatment: '',
          origin: ''
        });
        clearFile();
        
        console.log('Gemstone created successfully:', result.data);
      } else {
        // Error from server
        setNotification({
          type: 'error',
          message: result.message || 'Failed to add gemstone'
        });
      }
    } catch (error) {
      console.error('Error creating gemstone:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setNotification({
          type: 'error',
          message: 'Cannot connect to server. Please ensure backend is running.'
        });
      } else {
        setNotification({
          type: 'error',
          message: 'An unexpected error occurred. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear notification
   */
  const clearNotification = () => {
    setNotification({ type: '', message: '' });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-lg">➕</span>
          </div>
          Add New Gemstone
        </h3>
        <div className="text-3xl">💎</div>
      </div>

      {/* Notification */}
      {notification.message && (
        <div className={`mb-8 p-6 rounded-xl flex items-start justify-between ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start space-x-4">
            <div className="text-2xl">
              {notification.type === 'success' ? '✅' : '⚠️'}
            </div>
            <div>
              <h4 className={`font-medium text-lg ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notification.type === 'success' ? 'Success!' : 'Error!'}
              </h4>
              <p className={`text-sm mt-2 leading-relaxed ${
                notification.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
          <button
            onClick={clearNotification}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
            Gemstone Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Example: Blue Sapphire"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
            disabled={isLoading}
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-3">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detailed description about the gemstone..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 resize-none bg-white/50 backdrop-blur-sm"
            disabled={isLoading}
          />
        </div>

        {/* Weight and Dimensions Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="weight_carat" className="block text-sm font-medium text-gray-700 mb-3">
              Weight (Carat)
            </label>
            <input
              id="weight_carat"
              name="weight_carat"
              type="number"
              step="0.01"
              value={formData.weight_carat}
              onChange={handleInputChange}
              placeholder="2.50"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="dimensions_mm" className="block text-sm font-medium text-gray-700 mb-3">
              Dimensions (mm)
            </label>
            <input
              id="dimensions_mm"
              name="dimensions_mm"
              type="text"
              value={formData.dimensions_mm}
              onChange={handleInputChange}
              placeholder="8.5 x 6.5 x 4.2"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Color and Origin Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-3">
              Color
            </label>
            <input
              id="color"
              name="color"
              type="text"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Royal Blue"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-3">
              Origin
            </label>
            <input
              id="origin"
              name="origin"
              type="text"
              value={formData.origin}
              onChange={handleInputChange}
              placeholder="Sri Lanka"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Treatment Field */}
        <div>
          <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-3">
            Treatment
          </label>
          <input
            id="treatment"
            name="treatment"
            type="text"
            value={formData.treatment}
            onChange={handleInputChange}
            placeholder="Heat Treatment"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
            disabled={isLoading}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="gemstoneImage" className="block text-sm font-medium text-gray-700 mb-3">
            Gemstone Photo
          </label>
          
          {/* File Input */}
          <div className="flex items-center space-x-4">
            <input
              id="gemstoneImage"
              name="gemstoneImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            <label
              htmlFor="gemstoneImage"
              className={`cursor-pointer inline-flex items-center px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium transition duration-200 ${
                isLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white/50 text-gray-700 hover:bg-white hover:border-purple-300'
              }`}
            >
              📸 Choose Image
            </label>
            
            {selectedFile && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-red-500 hover:text-red-700 text-sm transition duration-200"
                  disabled={isLoading}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          
          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Preview:</p>
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-600 transition duration-200"
                  disabled={isLoading}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading || !formData.name.trim()}
            className={`w-full py-4 px-6 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-3 ${
              isLoading || !formData.name.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <span>💎</span>
                <span>Add Gemstone</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGemstoneForm;