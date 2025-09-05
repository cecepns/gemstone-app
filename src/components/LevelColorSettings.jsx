// ANCHOR: LevelColorSettings Component - Color picker for gemstone levels
import { Palette, Save } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useAuth } from '../context/useAuth';
import { getSettings, updateSetting } from '../utils/api';
import { showError, showSuccess } from '../utils/toast';

/**
 * LevelColorSettings component - Color picker for gemstone levels
 * Allows admin to set custom colors for each gemstone level (1-5)
 * Colors are used in GemstonePrintCard for visual identification
 *
 * @returns {React.ReactElement} - Rendered level color settings
 */
const LevelColorSettings = () => {
  const [levelColors, setLevelColors] = useState({
    level_1_color: '#3B82F6', // Blue
    level_2_color: '#10B981', // Green
    level_3_color: '#F59E0B', // Yellow
    level_4_color: '#EF4444', // Red
    level_5_color: '#8B5CF6', // Purple
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const { getAuthHeader } = useAuth();

  // Level descriptions for better UX
  const levelDescriptions = {
    level_1_color: 'Level 1 - Penjual Rough',
    level_2_color: 'Level 2 - Tukang Potong',
    level_3_color: 'Level 3 - Tukang Poles',
    level_4_color: 'Level 4 - Seller Pertama',
    level_5_color: 'Level 5 - Lab Gemologist',
  };

  // Load level colors on component mount
  useEffect(() => {
    loadLevelColors();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLevelColors = async() => {
    try {
      setIsLoadingSettings(true);
      const response = await getSettings(getAuthHeader());
      const settings = response.data;

      // Convert settings array to object
      const settingsObj = {};
      settings.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value || '';
      });

      setLevelColors({
        level_1_color: settingsObj.level_1_color || '#3B82F6',
        level_2_color: settingsObj.level_2_color || '#10B981',
        level_3_color: settingsObj.level_3_color || '#F59E0B',
        level_4_color: settingsObj.level_4_color || '#EF4444',
        level_5_color: settingsObj.level_5_color || '#8B5CF6',
      });
    } catch (error) {
      console.error('Error loading level colors:', error);
      showError('Gagal memuat pengaturan warna level');
    } finally {
      setIsLoadingSettings(false);
    }
  };

  // Handle color input changes
  const handleColorChange = (levelKey, color) => {
    setLevelColors(prev => ({
      ...prev,
      [levelKey]: color,
    }));
  };

  // Handle form submission
  const handleSaveColors = async(e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update all level color settings
      const updatePromises = Object.keys(levelColors).map(levelKey =>
        updateSetting(levelKey, levelColors[levelKey], getAuthHeader()),
      );

      await Promise.all(updatePromises);
      showSuccess('Pengaturan warna level berhasil disimpan');
    } catch (error) {
      showError(error.message || 'Gagal menyimpan pengaturan warna level');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to default colors
  const handleResetColors = () => {
    setLevelColors({
      level_1_color: '#3B82F6',
      level_2_color: '#10B981',
      level_3_color: '#F59E0B',
      level_4_color: '#EF4444',
      level_5_color: '#8B5CF6',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Palette className="w-5 h-5 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Pengaturan Warna Level</h3>
              <p className="text-sm text-gray-500 mt-1">Atur warna untuk setiap level gemstone</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetColors}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Reset Default
          </button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSaveColors} className="space-y-6">
          {/* Color Picker Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(levelColors).map((levelKey) => (
              <div key={levelKey} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {levelDescriptions[levelKey]}
                </label>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={levelColors[levelKey]}
                      onChange={(e) => handleColorChange(levelKey, e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      disabled={isLoadingSettings}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={levelColors[levelKey]}
                      onChange={(e) => handleColorChange(levelKey, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="#000000"
                      disabled={isLoadingSettings}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading || isLoadingSettings}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Warna Level
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LevelColorSettings;
