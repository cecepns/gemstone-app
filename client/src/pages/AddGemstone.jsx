// ANCHOR: AddGemstoneForm Component - Complete gemstone creation form with file upload
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createGemstone } from '../utils/api';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';
import { Gem, Save, AlertCircle, CheckCircle, Loader2, Camera, X, ArrowLeft, Trash2  } from 'lucide-react';
import { Button, Input, Textarea, Card, Alert } from '../components/ui';

const AddGemstone = () => {
  // Get auth context for token
  const { getAuthHeader } = useAuth();
  const navigate = useNavigate();

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
        showError('Hanya file gambar yang diperbolehkan (JPG, PNG, GIF)');
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
      showError('Nama batu mulia harus diisi');
      return false;
    }
    
    if (!formData.description.trim()) {
      showError('Deskripsi harus diisi');
      return false;
    }
    
    if (!formData.weight_carat.trim()) {
      showError('Berat dalam karat harus diisi');
      return false;
    }
    
    if (!formData.dimensions_mm.trim()) {
      showError('Dimensi dalam mm harus diisi');
      return false;
    }
    
    if (!formData.color.trim()) {
      showError('Warna harus diisi');
      return false;
    }
    
    if (!formData.origin.trim()) {
      showError('Asal/Origin harus diisi');
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
    const loadingToast = showLoading('Sedang menyimpan batu mulia...');

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

      // Dismiss loading toast
      dismissToast(loadingToast);

      // Success notification
      showSuccess(`Batu mulia "${formData.name}" berhasil ditambahkan dengan ID: ${result.data.unique_id_number}`);
      
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
      
      // Dismiss loading toast
      dismissToast(loadingToast);
      
      // Show error toast
      showError(error.message || 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Back button header (match GemstoneDetail layout) */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate('/admin/gemstones')}
          className="rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar
        </Button>
      </div>

      <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Gem className="w-5 h-5 text-purple-600" />
          </div>
          Tambah Batu Mulia Baru
        </h3>
      </div>

      {/* Notification */}
      {/* The notification state and Alert component are removed as per the new_code,
          but the toast utilities are now directly imported. */}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Menambahkan Batu Mulia...</h3>
          <p className="text-gray-600">Mohon tunggu sementara kami memproses permintaan Anda</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name Field */}
        <Input
          label="Nama Batu Mulia"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Contoh: Safir Biru"
          disabled={isLoading}
          required
          size="lg"
          className="bg-white/50 backdrop-blur-sm"
        />

        {/* Description Field */}
        <Textarea
          label="Deskripsi"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi detail tentang batu mulia..."
          rows={4}
          disabled={isLoading}
          required
          size="lg"
          className="bg-white/50 backdrop-blur-sm"
        />

        {/* Weight and Dimensions Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Berat"
            name="weight_carat"
            type="number"
            step="0.01"
            value={formData.weight_carat}
            onChange={handleInputChange}
            placeholder="2.50"
            disabled={isLoading}
            required
            size="lg"
            className="bg-white/50 backdrop-blur-sm"
          />
          
          <Input
            label="Dimensi (mm)"
            name="dimensions_mm"
            type="text"
            value={formData.dimensions_mm}
            onChange={handleInputChange}
            placeholder="8.5 x 6.5 x 4.2"
            disabled={isLoading}
            required
            size="lg"
            className="bg-white/50 backdrop-blur-sm"
          />
        </div>

        {/* Color and Origin Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Warna"
            name="color"
            type="text"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="Biru Royal"
            disabled={isLoading}
            required
            size="lg"
            className="bg-white/50 backdrop-blur-sm"
          />
          
          <Input
            label="Asal"
            name="origin"
            type="text"
            value={formData.origin}
            onChange={handleInputChange}
            placeholder="Sri Lanka"
            disabled={isLoading}
            required
            size="lg"
            className="bg-white/50 backdrop-blur-sm"
          />
        </div>

        {/* Treatment Field */}
        <Input
          label="Perawatan"
          name="treatment"
          type="text"
          value={formData.treatment}
          onChange={handleInputChange}
          placeholder="Perawatan Panas"
          disabled={isLoading}
          required
          size="lg"
          className="bg-white/50 backdrop-blur-sm"
        />

        {/* Image Upload */}
        <div>
          <label htmlFor="gemstoneImage" className="block text-sm font-medium text-gray-700 mb-3">
            Foto Batu Mulia
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
              required
            />
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('gemstoneImage').click()}
              disabled={isLoading}
              className="bg-white/50 hover:bg-white hover:border-purple-300"
            >
              <Camera className="w-4 h-4 mr-2" />
              Pilih Gambar
            </Button>
          </div>
          
          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Pratinjau:</p>
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
                  iconOnly
                  className="absolute -top-2 -right-2 w-7 h-7 p-0 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
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
                Menambahkan Batu Mulia...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Tambah Batu Mulia
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
    </>
  );
};

export default AddGemstone;