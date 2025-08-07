// ANCHOR: AddGemstoneForm Component - Complete gemstone creation form with file upload
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createGemstone } from '../utils/api';
import { Gem, Save, AlertCircle, CheckCircle, Loader2, Camera, X } from 'lucide-react';
import { Button, Input, Textarea, Card, Alert } from '../components/ui';

const AddGemstone = () => {
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

      // Use API utility to create gemstone
      const result = await createGemstone(submitData, getAuthHeader());

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
    } catch (error) {
      console.error('Error creating gemstone:', error);
      setNotification({
        type: 'error',
        message: error.message || 'An unexpected error occurred. Please try again.'
      });
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
    <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Gem className="w-5 h-5 text-purple-600" />
          </div>
          Add New Gemstone
        </h3>
      </div>

      {/* Notification */}
      {notification.message && (
        <Alert 
          type={notification.type === 'success' ? 'success' : 'danger'}
          title={notification.type === 'success' ? 'Success' : 'Error'}
          dismissible
          onDismiss={clearNotification}
          className="mb-6"
        >
          {notification.message}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Adding Gemstone...</h3>
          <p className="text-gray-600">Please wait while we process your request</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name Field */}
        <Input
          label="Gemstone Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Example: Blue Sapphire"
          disabled={isLoading}
          required
          size="lg"
          className="bg-white/50 backdrop-blur-sm"
        />

        {/* Description Field */}
        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Detailed description about the gemstone..."
          rows={4}
          disabled={isLoading}
          size="lg"
          className="bg-white/50 backdrop-blur-sm"
        />

        {/* Weight and Dimensions Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Weight (Carat)"
            name="weight_carat"
            type="number"
            step="0.01"
            value={formData.weight_carat}
            onChange={handleInputChange}
            placeholder="2.50"
            disabled={isLoading}
            size="lg"
            className="bg-white/50 backdrop-blur-sm"
          />
          
          <Input
            label="Dimensions (mm)"
            name="dimensions_mm"
            type="text"
            value={formData.dimensions_mm}
            onChange={handleInputChange}
            placeholder="8.5 x 6.5 x 4.2"
            disabled={isLoading}
            size="lg"
            className="bg-white/50 backdrop-blur-sm"
          />
        </div>

        {/* Color and Origin Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Color"
            name="color"
            type="text"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="Royal Blue"
            disabled={isLoading}
            size="lg"
            className="bg-white/50 backdrop-blur-sm"
          />
          
          <Input
            label="Origin"
            name="origin"
            type="text"
            value={formData.origin}
            onChange={handleInputChange}
            placeholder="Sri Lanka"
            disabled={isLoading}
            size="lg"
            className="bg-white/50 backdrop-blur-sm"
          />
        </div>

        {/* Treatment Field */}
        <Input
          label="Treatment"
          name="treatment"
          type="text"
          value={formData.treatment}
          onChange={handleInputChange}
          placeholder="Heat Treatment"
          disabled={isLoading}
          size="lg"
          className="bg-white/50 backdrop-blur-sm"
        />

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
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('gemstoneImage').click()}
              disabled={isLoading}
              className="bg-white/50 hover:bg-white hover:border-purple-300"
            >
              <Camera className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
            
            {selectedFile && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                  disabled={isLoading}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
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
                <Button
                  variant="danger"
                  size="sm"
                  onClick={clearFile}
                  disabled={isLoading}
                  className="absolute -top-2 -right-2 w-7 h-7 p-0 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || !formData.name.trim()}
            loading={isLoading}
            fullWidth
            className="py-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Adding Gemstone...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Add Gemstone
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddGemstone;