// ANCHOR: GemstoneLevelCard Component - Reusable component for displaying gemstone supply chain levels
import {
  CheckCircle,
  Package,
  Scissors,
  Sparkles,
  Store,
  Building2,
  Award,
  Target,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { getPublicSettings } from '../../utils/api';
import { Card } from '../ui';

/**
 * GemstoneLevelCard component - Displays gemstone supply chain levels
 * Shows current level based on number of completed data fields
 * />
 *
 * @param {Object} props - Component props
 * @param {Object} props.gemstone - Gemstone data object
 * @param {string} props.gemstone.rough_seller - Level 1 data
 * @param {string} props.gemstone.cutter - Level 2 data
 * @param {string} props.gemstone.polisher - Level 3 data
 * @param {string} props.gemstone.first_seller - Level 4 data
 * @param {string} props.gemstone.gemologist_lab - Level 5 data
 * @param {string} [props.title="Level Batu Mulia"] - Card title
 * @param {string} [props.subtitle="Tingkat supply chain batu mulia"] - Card subtitle
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactElement} - Rendered level card component
 */
const GemstoneLevelCard = ({
  gemstone,
  title = 'Level Batu Mulia',
  subtitle = 'Tingkat supply chain batu mulia',
  className = '',
}) => {
  // State untuk menyimpan pengaturan warna level
  const [levelColors, setLevelColors] = useState({});

  // Fungsi untuk memuat pengaturan warna level dari server
  const loadLevelColors = async() => {
    try {
      const response = await getPublicSettings();
      const settingsData = response.data;

      setLevelColors({
        level_1_color: settingsData.level_1_color,
        level_2_color: settingsData.level_2_color,
        level_3_color: settingsData.level_3_color,
        level_4_color: settingsData.level_4_color,
        level_5_color: settingsData.level_5_color,
      });
    } catch (_error) {
      // console.error('Error loading level colors:', _error);
      // Keep default values if loading fails
    }
  };

  // Data fields yang menjadi acuan level
  const levelFields = ['rough_seller', 'cutter', 'polisher', 'first_seller', 'gemologist_lab'];
  // Level configuration data
  const levels = [
    {
      key: 'rough_seller',
      title: 'Penjual Rough',
      description: 'Data penjual batu mulia dalam bentuk rough (mentah)',
      icon: Package,
      shortDesc: 'Rough Seller',
    },
    {
      key: 'cutter',
      title: 'Tukang Potong',
      description: 'Data tukang potong yang memotong batu mulia',
      icon: Scissors,
      shortDesc: 'Cutter',
    },
    {
      key: 'polisher',
      title: 'Finisher',
      description: 'Data finisher yang memoles batu mulia',
      icon: Sparkles,
      shortDesc: 'Finisher',
    },
    {
      key: 'first_seller',
      title: 'Seller Pertama',
      description: 'Data seller pertama yang menjual batu mulia',
      icon: Store,
      shortDesc: 'First Seller',
    },
    {
      key: 'gemologist_lab',
      title: 'Lab Gemologist',
      description: 'Data lab resmi gemologist yang memverifikasi batu mulia',
      icon: Building2,
      shortDesc: 'Gemologist Lab',
    },
  ];

  // Calculate current level based on number of completed data
  const completedData = levelFields.filter(field => gemstone[field] && gemstone[field].trim() !== '').length;
  const currentLevel = completedData;

  // Get level info with dynamic colors from server
  const getLevelInfo = (level) => {
    const defaultColors = {
      0: {
        title: 'Belum Ada Level',
        icon: Target,
        color: '#6B7280',
        bgColor: '#F3F4F6',
        borderColor: '#D1D5DB',
      },
      1: {
        title: 'Level 1',
        icon: Package,
        color: '#EF4444',
        bgColor: '#FEF2F2',
        borderColor: '#FECACA',
      },
      2: {
        title: 'Level 2',
        icon: Scissors,
        color: '#F97316',
        bgColor: '#FFF7ED',
        borderColor: '#FED7AA',
      },
      3: {
        title: 'Level 3',
        icon: Sparkles,
        color: '#EAB308',
        bgColor: '#FEFCE8',
        borderColor: '#FDE047',
      },
      4: {
        title: 'Level 4',
        icon: Store,
        color: '#22C55E',
        bgColor: '#F0FDF4',
        borderColor: '#BBF7D0',
      },
      5: {
        title: 'Level 5',
        icon: Award,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
        borderColor: '#BFDBFE',
      },
    };

    const baseConfig = defaultColors[level] || defaultColors[0];

    // Use server colors if available, otherwise use default colors
    if (level > 0 && levelColors[`level_${level}_color`]) {
      const serverColor = levelColors[`level_${level}_color`];
      return {
        ...baseConfig,
        color: serverColor,
        bgColor: `${serverColor}15`, // 15% opacity
        borderColor: `${serverColor}40`, // 40% opacity
      };
    }

    return baseConfig;
  };

  const levelInfo = getLevelInfo(currentLevel);
  const LevelIcon = levelInfo.icon;

  // Load level colors on component mount
  useEffect(() => {
    loadLevelColors();
  }, []);

  return (
    <Card variant="elevated" padding="lg" className={className}>
      <Card.Header>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: levelInfo.bgColor,
                borderColor: levelInfo.borderColor,
                borderWidth: '2px',
                borderStyle: 'solid',
              }}
            >
              <LevelIcon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: levelInfo.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
            <div className="text-xl sm:text-2xl font-bold" style={{ color: levelInfo.color }}>
              {levelInfo.title}
            </div>
            <div className="text-xs text-gray-500">
              {completedData}/5 Data
            </div>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {levels.map((level) => {
              const hasData = gemstone[level.key] && gemstone[level.key].trim() !== '';
              const IconComponent = level.icon;

              return (
                <div
                  key={level.key}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                    hasData
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      hasData ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {hasData ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-medium truncate ${
                        hasData ? 'text-green-800' : 'text-gray-500'
                      }`}
                    >
                      {level.shortDesc}
                    </p>
                    {hasData && (
                      <p className="text-xs text-green-600 truncate">
                        {gemstone[level.key]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GemstoneLevelCard;
