// ANCHOR: GemstoneForm Component - Shared form component for Add and Edit gemstone
import { Gem, Save, Loader2, Camera, ArrowLeft, Trash2 } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/useAuth';
import { getGemstoneDetail, createGemstone, updateGemstone } from '../utils/api';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';

import { Button, Input, Textarea, Card } from './ui';

const GemstoneForm = ({
  mode = 'add', // 'add' or 'edit'
  gemstoneId = null,
  onSuccess = null,
  backPath = '/admin/gemstones',
  backLabel = 'Kembali ke Daftar',
}) => {
  // Auth and routing
  const { getAuthHeader } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight_carat: '',
    dimensions_mm: '',
    color: '',
    treatment: '',
    origin: '',
    rough_seller: '',
    cutter: '',
    polisher: '',
    first_seller: '',
    gemologist_lab: '',
  });

  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEditMode = useMemo(() => mode === 'edit', [mode]);

  const fetchGemstoneData = useCallback(async() => {
    if (!isEditMode || !gemstoneId) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await getGemstoneDetail(gemstoneId, getAuthHeader());
      const gemstone = result.data || {};

      setFormData({
        name: gemstone.name || '',
        description: gemstone.description || '',
        weight_carat: gemstone.weight_carat !== null && gemstone.weight_carat !== undefined ? String(gemstone.weight_carat) : '',
        dimensions_mm: gemstone.dimensions_mm || '',
        color: gemstone.color || '',
        treatment: gemstone.treatment || '',
        origin: gemstone.origin || '',
        rough_seller: gemstone.rough_seller || '',
        cutter: gemstone.cutter || '',
        polisher: gemstone.polisher || '',
        first_seller: gemstone.first_seller || '',
        gemologist_lab: gemstone.gemologist_lab || '',
      });

      setExistingPhotoUrl(gemstone.photo_url || null);
    } catch (error) {
      showError(error.message || 'Gagal memuat data batu mulia');
    } finally {
      setIsLoading(false);
    }
  }, [isEditMode, gemstoneId, getAuthHeader]);

  // Set initial loading state for edit mode
  useEffect(() => {
    if (isEditMode && gemstoneId) {
      setIsLoading(true);
    }
  }, [isEditMode, gemstoneId]);

  useEffect(() => {
    if (isEditMode && gemstoneId) {
      fetchGemstoneData();
    }
  }, [isEditMode, gemstoneId, fetchGemstoneData]);

  /**
   * Handle input field changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle file selection and preview
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
    if (fileInput) {
      fileInput.value = '';
    }
  };

  /**
   * Validate form data
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

    if (!formData.weight_carat.toString().trim()) {
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
   */
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    const loadingToast = showLoading(
      isEditMode ? 'Menyimpan perubahan...' : 'Sedang menyimpan batu mulia...',
    );

    try {
      // Create FormData object
      const submitData = new FormData();

      // Append all form fields
      Object.keys(formData).forEach(key => {
        // Allow empty strings for level fields and other optional fields
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      // Append file if selected
      if (selectedFile) {
        submitData.append('gemstoneImage', selectedFile);
      }

      let result;
      if (isEditMode) {
        result = await updateGemstone(gemstoneId, submitData, getAuthHeader());
      } else {
        result = await createGemstone(submitData, getAuthHeader());
      }

      // Dismiss loading toast
      dismissToast(loadingToast);

      // Success notification
      if (isEditMode) {
        showSuccess(`Batu mulia "${result.data?.name || formData.name}" berhasil diperbarui`);
      } else {
        showSuccess(`Batu mulia "${formData.name}" berhasil ditambahkan dengan ID: ${result.data.unique_id_number}`);
      }

      // Handle success callback or navigation
      if (onSuccess) {
        onSuccess(result);
      } else {
        if (isEditMode) {
          navigate(`/admin/gemstones/${gemstoneId}`);
        } else {
          navigate('/admin/gemstones');
        }
      }

    } catch (error) {
      // Dismiss loading toast
      dismissToast(loadingToast);

      // Show error toast
      showError(error.message || 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  // Loading state for edit mode
  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {isEditMode ? 'Memuat data batu mulia...' : 'Menambahkan Batu Mulia...'}
          </h3>
          <p className="text-gray-600">Mohon tunggu sementara kami memproses permintaan Anda</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Back button header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate(backPath)}
          className="rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backLabel}
        </Button>
      </div>

      <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gem className="w-5 h-5 text-purple-600" />
            </div>
            {isEditMode ? 'Ubah Batu Mulia' : 'Tambah Batu Mulia Baru'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <Input
            label="Nama Batu Mulia"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Contoh: Safir Biru"
            disabled={saving}
            required
            size="md"
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
            disabled={saving}
            required
            size="md"
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
              disabled={saving}
              required
              size="md"
              className="bg-white/50 backdrop-blur-sm"
            />

            <Input
              label="Dimensi (mm)"
              name="dimensions_mm"
              type="text"
              value={formData.dimensions_mm}
              onChange={handleInputChange}
              placeholder="8.5 x 6.5 x 4.2"
              disabled={saving}
              required
              size="md"
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
              disabled={saving}
              required
              size="md"
              className="bg-white/50 backdrop-blur-sm"
            />

            <Input
              label="Asal"
              name="origin"
              type="text"
              value={formData.origin}
              onChange={handleInputChange}
              placeholder="Sri Lanka"
              disabled={saving}
              required
              size="md"
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
            disabled={saving}
            size="md"
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
                disabled={saving}
                required={!isEditMode}
              />
              <Button
                variant="outline"
                size="md"
                onClick={() => document.getElementById('gemstoneImage').click()}
                disabled={saving}
                className="bg-white/50 hover:bg-white hover:border-purple-300"
              >
                <Camera className="w-4 h-4 mr-2" />
                Pilih Gambar
              </Button>
            </div>

            {/* Image Preview */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Existing image (edit mode only) */}
              {isEditMode && existingPhotoUrl && !previewUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Gambar saat ini:</p>
                  <img
                    src={existingPhotoUrl}
                    alt="Existing"
                    className="w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                </div>
              )}

              {/* New image preview */}
              {previewUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    {isEditMode ? 'Pratinjau baru:' : 'Pratinjau:'}
                  </p>
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
                      disabled={saving}
                      className="absolute top-2 right-2"
                      iconOnly
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Level Fields */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">
              Level Batu Mulia
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Penjual Rough"
                name="rough_seller"
                type="text"
                value={formData.rough_seller}
                onChange={handleInputChange}
                placeholder="Data penjual rough"
                disabled={saving}
                size="md"
                className="bg-white/50 backdrop-blur-sm"
              />
              <Input
                label="Tukang Potong"
                name="cutter"
                type="text"
                value={formData.cutter}
                onChange={handleInputChange}
                placeholder="Data tukang potong"
                disabled={saving}
                size="md"
                className="bg-white/50 backdrop-blur-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Finisher"
                name="polisher"
                type="text"
                value={formData.polisher}
                onChange={handleInputChange}
                placeholder="Data finisher"
                disabled={saving}
                size="md"
                className="bg-white/50 backdrop-blur-sm"
              />
              <Input
                label="Seller Pertama"
                name="first_seller"
                type="text"
                value={formData.first_seller}
                onChange={handleInputChange}
                placeholder="Data seller pertama"
                disabled={saving}
                size="md"
                className="bg-white/50 backdrop-blur-sm"
              />
            </div>

            <Input
              label="Lab Gemologist Resmi"
              name="gemologist_lab"
              type="text"
              value={formData.gemologist_lab}
              onChange={handleInputChange}
              placeholder="Data lab resmi gemologist"
              disabled={saving}
              size="md"
              className="bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={saving || !formData.name.trim()}
              loading={saving}
              fullWidth
            >
              {saving ? (
                <>
                  {isEditMode ? 'Menyimpan Perubahan...' : 'Menambahkan Batu Mulia...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEditMode ? 'Simpan Perubahan' : 'Tambah Batu Mulia'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default GemstoneForm;
