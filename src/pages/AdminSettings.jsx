import { Download, Lock, Eye, EyeOff, Mail, Phone, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useAuth } from '../context/useAuth';
import { changeAdminPassword, downloadDatabaseBackup, getSettings, updateSetting } from '../utils/api';
import { showError, showSuccess } from '../utils/toast';

const AdminSettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactSettings, setContactSettings] = useState({
    email: '',
    phone: '',
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const { getAuthHeader } = useAuth();

  // ANCHOR: Load contact settings on component mount
  useEffect(() => {
    loadContactSettings();
  }, []);

  const loadContactSettings = async() => {
    try {
      const response = await getSettings(getAuthHeader());
      const settings = response.data;

      // Convert settings array to object
      const settingsObj = {};
      settings.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value || '';
      });

      setContactSettings({
        email: settingsObj.email || '',
        phone: settingsObj.phone || '',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      showError('Gagal memuat pengaturan kontak');
    }
  };

  // ANCHOR: Handle contact settings form submission
  const handleContactSettingsSave = async(e) => {
    e.preventDefault();
    setIsLoadingSettings(true);

    try {
      // Update email setting
      await updateSetting('email', contactSettings.email, getAuthHeader());

      // Update phone setting
      await updateSetting('phone', contactSettings.phone, getAuthHeader());

      showSuccess('Pengaturan kontak berhasil disimpan');
    } catch (error) {
      showError(error.message || 'Gagal menyimpan pengaturan kontak');
    } finally {
      setIsLoadingSettings(false);
    }
  };

  // ANCHOR: Handle input changes for contact settings
  const handleContactInputChange = (field, value) => {
    setContactSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // ANCHOR: Handle password change form submission
  const handlePasswordChange = async(e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target);
      const currentPassword = formData.get('currentPassword');
      const newPassword = formData.get('newPassword');
      const confirmPassword = formData.get('confirmPassword');

      if (!currentPassword || !newPassword || !confirmPassword) {
        showError('Semua field sandi wajib diisi');
        return;
      }

      if (newPassword !== confirmPassword) {
        showError('Konfirmasi sandi tidak cocok');
        return;
      }

      await changeAdminPassword({ currentPassword, newPassword }, getAuthHeader());
      showSuccess('Kata sandi berhasil diubah');
      e.target.reset();
    } catch (error) {
      showError(error.message || 'Gagal mengubah kata sandi');
    } finally {
      setIsLoading(false);
    }
  };

  // ANCHOR: Handle database backup
  const handleBackupDatabase = async() => {
    setIsLoading(true);

    try {
      const { blob, filename } = await downloadDatabaseBackup(getAuthHeader());
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccess('Backup database berhasil dibuat');
    } catch (error) {
      showError(error.message || 'Gagal membuat backup database');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Admin</h1>
            <p className="text-gray-600 mt-1">Kelola informasi kontak, kata sandi dan backup sistem</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Change */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-purple-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Ganti Sandi</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">Ubah kata sandi akun admin</p>
          </div>
          <div className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sandi Saat Ini
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    name="currentPassword"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Masukkan sandi saat ini"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    name="newPassword"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Masukkan sandi baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    name="confirmPassword"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Konfirmasi sandi baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Mengubah Sandi...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Ubah Sandi
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Database Backup */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Download className="w-5 h-5 text-purple-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Backup Database</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">Cadangkan data database dalam format SQL</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <button
                onClick={handleBackupDatabase}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Membuat Backup...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Backup Database SQL
                  </>
                )}
              </button>

              <div className="text-xs text-gray-500 text-center">
                File backup akan otomatis diunduh dalam format .sql
              </div>
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-purple-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Pengaturan Kontak</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">Kelola informasi kontak</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleContactSettingsSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Kontak
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={contactSettings.email}
                    onChange={(e) => handleContactInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Masukkan email kontak"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={contactSettings.phone}
                    onChange={(e) => handleContactInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Masukkan nomor telepon"
                  />
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoadingSettings}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingSettings ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Pengaturan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
