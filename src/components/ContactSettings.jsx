// ANCHOR: ContactSettings Component - Contact information management
import { Mail, Phone, Save, Instagram } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useAuth } from '../context/useAuth';
import { getSettings, updateSetting } from '../utils/api';
import { showError, showSuccess } from '../utils/toast';

/**
 * ContactSettings component - Contact information management
 * Allows admin to manage contact information (email, phone, Instagram)
 *
 * @returns {React.ReactElement} - Rendered contact settings
 */
const ContactSettings = () => {
  const [contactSettings, setContactSettings] = useState({
    email: '',
    phone: '',
    instagram: '',
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const { getAuthHeader } = useAuth();

  // Load contact settings on component mount
  useEffect(() => {
    loadContactSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        instagram: settingsObj.instagram || '',
      });
    } catch (_error) {
      showError('Gagal memuat pengaturan kontak');
    }
  };

  // Handle contact settings form submission
  const handleContactSettingsSave = async(e) => {
    e.preventDefault();
    setIsLoadingSettings(true);

    try {
      // Update all settings
      await updateSetting('email', contactSettings.email, getAuthHeader());
      await updateSetting('phone', contactSettings.phone, getAuthHeader());
      await updateSetting('instagram', contactSettings.instagram, getAuthHeader());

      showSuccess('Pengaturan kontak berhasil disimpan');
    } catch (error) {
      showError(error.message || 'Gagal menyimpan pengaturan kontak');
    } finally {
      setIsLoadingSettings(false);
    }
  };

  // Handle input changes for contact settings
  const handleContactInputChange = (field, value) => {
    setContactSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <div className="relative">
              <input
                type="text"
                value={contactSettings.instagram}
                onChange={(e) => handleContactInputChange('instagram', e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Masukkan username Instagram"
              />
              <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
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
  );
};

export default ContactSettings;
