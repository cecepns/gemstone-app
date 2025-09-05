// ANCHOR: EditGemstoneForm Component - Edit existing gemstone with optional image update
import { Gem, Save, Loader2, Camera, X, ArrowLeft, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button, Input, Textarea, Card } from '../components/ui';
import { useAuth } from '../context/useAuth';
import { getGemstoneDetail, updateGemstone } from '../utils/api';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';

const EditGemstone = () => {
  // Auth and routing
  const { getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight_carat: '',
    dimensions_mm: '',
    color: '',
    treatment: '',
    origin: '',
    level_1_rough_seller: '',
    level_2_cutter: '',
    level_3_polisher: '',
    level_4_first_seller: '',
    level_5_gemologist_lab: '',
  });
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /**
   * Fetch gemstone data by id and prefill form
   */
  const fetchDetail = async() => {
    try {
      setIsLoading(true);
      const result = await getGemstoneDetail(id, getAuthHeader());
      const g = result.data || {};
      setFormData({
        name: g.name || '',
        description: g.description || '',
        weight_carat: g.weight_carat !== null && g.weight_carat !== undefined ? String(g.weight_carat) : '',
        dimensions_mm: g.dimensions_mm || '',
        color: g.color || '',
        treatment: g.treatment || '',
        origin: g.origin || '',
        level_1_rough_seller: g.level_1_rough_seller || '',
        level_2_cutter: g.level_2_cutter || '',
        level_3_polisher: g.level_3_polisher || '',
        level_4_first_seller: g.level_4_first_seller || '',
        level_5_gemologist_lab: g.level_5_gemologist_lab || '',
      });
      setExistingPhotoUrl(g.photo_url || null);
    } catch (error) {
      showError(error.message || 'Gagal memuat data batu mulia');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  /**
   * Handle input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle file select + preview
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      showError('Hanya file gambar yang diperbolehkan (JPG, PNG, GIF)');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  /**
   * Clear selected file
   */
  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById('gemstoneImageEdit');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  /**
   * Validate minimal required fields
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
   * Submit updates
   */
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    const loadingToast = showLoading('Menyimpan perubahan...');
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (selectedFile) {
        fd.append('gemstoneImage', selectedFile);
      }

      const result = await updateGemstone(id, fd, getAuthHeader());
      dismissToast(loadingToast);
      showSuccess(`Batu mulia "${result.data?.name || formData.name}" berhasil diperbarui`);
      navigate(`/admin/gemstones/${id}`);
    } catch (error) {
      dismissToast(loadingToast);
      showError(error.message || 'Terjadi kesalahan saat menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Memuat data batu mulia...</h3>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Back button header (match GemstoneDetail layout) */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
        {(() => {
          const from = location.state?.from;
          const targetPath = from === 'detail' ? `/admin/gemstones/${id}` : '/admin/gemstones';
          const label = from === 'detail' ? 'Kembali ke Detail' : 'Kembali ke Daftar';
          return (
            <Button
              variant="secondary"
              onClick={() => navigate(targetPath)}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {label}
            </Button>
          );
        })()}
      </div>

      <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gem className="w-5 h-5 text-purple-600" />
            </div>
            Ubah Batu Mulia
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-8">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">
              Data Utama Batu Mulia
            </h4>
            <Input label="Nama Batu Mulia" name="name" type="text" value={formData.name} onChange={handleInputChange} disabled={saving} required size="lg" className="bg-white/50 backdrop-blur-sm" />

            <Textarea label="Deskripsi" name="description" value={formData.description} onChange={handleInputChange} rows={4} disabled={saving} required size="lg" className="bg-white/50 backdrop-blur-sm" />

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Berat" name="weight_carat" type="number" step="0.01" value={formData.weight_carat} onChange={handleInputChange} disabled={saving} required size="lg" className="bg-white/50 backdrop-blur-sm" />
              <Input label="Dimensi (mm)" name="dimensions_mm" type="text" value={formData.dimensions_mm} onChange={handleInputChange} disabled={saving} required size="lg" className="bg-white/50 backdrop-blur-sm" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Warna" name="color" type="text" value={formData.color} onChange={handleInputChange} disabled={saving} required size="lg" className="bg-white/50 backdrop-blur-sm" />
              <Input label="Asal" name="origin" type="text" value={formData.origin} onChange={handleInputChange} disabled={saving} required size="lg" className="bg-white/50 backdrop-blur-sm" />
            </div>

            <Input label="Perawatan" name="treatment" type="text" value={formData.treatment} onChange={handleInputChange} disabled={saving} required size="lg" className="bg-white/50 backdrop-blur-sm" />

            <div>
              <label htmlFor="gemstoneImageEdit" className="block text-sm font-medium text-gray-700 mb-3">Foto Batu Mulia</label>
              <div className="flex items-center space-x-4">
                <input id="gemstoneImageEdit" name="gemstoneImage" type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={saving} />
                <Button variant="outline" size="lg" onClick={() => document.getElementById('gemstoneImageEdit').click()} disabled={saving} className="bg-white/50 hover:bg-white hover:border-purple-300">
                  <Camera className="w-4 h-4 mr-2" />
                  Pilih Gambar
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {(existingPhotoUrl && !previewUrl) && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Gambar saat ini:</p>
                    <img src={existingPhotoUrl} alt="Existing" className="w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm" />
                  </div>
                )}
                {previewUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Pratinjau baru:</p>
                    <div className="relative inline-block">
                      <img src={previewUrl} alt="Preview" className="w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm" />
                      <Button variant="danger" size="sm" iconOnly onClick={clearFile} disabled={saving} className="absolute -top-2 -right-2 w-7 h-7 p-0 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">
              Level Batu Mulia
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Level 1 - Penjual Rough"
                name="level_1_rough_seller"
                type="text"
                value={formData.level_1_rough_seller}
                onChange={handleInputChange}
                disabled={saving}
                size="lg"
                className="bg-white/50 backdrop-blur-sm"
                placeholder="Data penjual rough (level 1)"
              />
              <Input
                label="Level 2 - Tukang Potong"
                name="level_2_cutter"
                type="text"
                value={formData.level_2_cutter}
                onChange={handleInputChange}
                disabled={saving}
                size="lg"
                className="bg-white/50 backdrop-blur-sm"
                placeholder="Data tukang potong (level 2)"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Level 3 - Tukang Poles"
                name="level_3_polisher"
                type="text"
                value={formData.level_3_polisher}
                onChange={handleInputChange}
                disabled={saving}
                size="lg"
                className="bg-white/50 backdrop-blur-sm"
                placeholder="Data tukang poles (level 3)"
              />
              <Input
                label="Level 4 - Seller Pertama"
                name="level_4_first_seller"
                type="text"
                value={formData.level_4_first_seller}
                onChange={handleInputChange}
                disabled={saving}
                size="lg"
                className="bg-white/50 backdrop-blur-sm"
                placeholder="Data seller pertama (level 4)"
              />
            </div>

            <Input
              label="Level 5 - Lab Gemologist Resmi"
              name="level_5_gemologist_lab"
              type="text"
              value={formData.level_5_gemologist_lab}
              onChange={handleInputChange}
              disabled={saving}
              size="lg"
              className="bg-white/50 backdrop-blur-sm"
              placeholder="Data lab resmi gemologist (level 5)"
            />
          </div>

          <div className="pt-6">
            <Button type="submit" variant="primary" size="lg" disabled={saving || !formData.name.trim()} loading={saving} fullWidth className="py-4">
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Menyimpan Perubahan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default EditGemstone;

