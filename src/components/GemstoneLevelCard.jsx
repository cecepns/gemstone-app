// ANCHOR: GemstoneLevelCard Component - Reusable component for displaying gemstone supply chain levels
import {
  TrendingUp,
  CheckCircle,
  Package,
  Scissors,
  Sparkles,
  Store,
  Building2,
} from 'lucide-react';
import { Card, Badge } from './ui';

/**
 * GemstoneLevelCard component - Displays gemstone supply chain levels
 * Shows step-by-step indicators for each level of the gemstone supply chain
 * 
 * @example
 * // Basic usage
 * <GemstoneLevelCard gemstone={gemstoneData} />
 * 
 * @example
 * // With custom title and styling
 * <GemstoneLevelCard 
 *   gemstone={gemstoneData} 
 *   title="Supply Chain Traceability"
 *   subtitle="Track gemstone journey from rough to certified"
 *   className="custom-styling"
 * />
 *
 * @param {Object} props - Component props
 * @param {Object} props.gemstone - Gemstone data object
 * @param {string} props.gemstone.level_1_rough_seller - Level 1 data
 * @param {string} props.gemstone.level_2_cutter - Level 2 data
 * @param {string} props.gemstone.level_3_polisher - Level 3 data
 * @param {string} props.gemstone.level_4_first_seller - Level 4 data
 * @param {string} props.gemstone.level_5_gemologist_lab - Level 5 data
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
  // Level configuration data
  const levels = [
    {
      key: 'level_1_rough_seller',
      title: 'Level 1: Penjual Rough',
      description: 'Data penjual batu mulia dalam bentuk rough (mentah)',
      icon: Package,
      iconColor: 'text-orange-600',
    },
    {
      key: 'level_2_cutter',
      title: 'Level 2: Tukang Potong',
      description: 'Data tukang potong yang memotong batu mulia',
      icon: Scissors,
      iconColor: 'text-blue-600',
    },
    {
      key: 'level_3_polisher',
      title: 'Level 3: Tukang Poles',
      description: 'Data tukang poles yang memoles batu mulia',
      icon: Sparkles,
      iconColor: 'text-purple-600',
    },
    {
      key: 'level_4_first_seller',
      title: 'Level 4: Seller Pertama',
      description: 'Data seller pertama yang menjual batu mulia',
      icon: Store,
      iconColor: 'text-green-600',
    },
    {
      key: 'level_5_gemologist_lab',
      title: 'Level 5: Lab Gemologist',
      description: 'Data lab resmi gemologist yang memverifikasi batu mulia',
      icon: Building2,
      iconColor: 'text-indigo-600',
    },
  ];

  // Calculate completed levels
  const completedLevels = levels.filter(level => gemstone[level.key]).length;

  // Generate summary message
  const getSummaryMessage = () => {
    if (completedLevels === 0) {
      return 'Belum ada level yang diselesaikan. Tambahkan data untuk setiap level supply chain.';
    } else if (completedLevels === 5) {
      return 'Semua level supply chain telah diselesaikan. Batu mulia memiliki traceability lengkap.';
    } else {
      return `${completedLevels} dari 5 level telah diselesaikan. Lanjutkan untuk melengkapi traceability.`;
    }
  };

  return (
    <Card variant="elevated" padding="lg" className={className}>
      <Card.Header>
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-orange-600" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        <div className="space-y-6">
          {/* Level Steps */}
          <div className="relative">
            {/* Connection lines */}
            <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gray-200" />

            {levels.map((level, index) => {
              const IconComponent = level.icon;
              const hasData = gemstone[level.key];
              const isLast = index === levels.length - 1;

              return (
                <div
                  key={level.key}
                  className={`relative flex items-start gap-4 ${isLast ? '' : 'pb-6'}`}
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      hasData
                        ? 'bg-green-100 border-green-500 text-green-600'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}
                  >
                    {hasData ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <IconComponent className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {level.title}
                      </h3>
                      {hasData && (
                        <Badge variant="success" size="sm">
                          Selesai
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {level.description}
                    </p>
                    {hasData ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800 font-medium">
                          Data tersedia
                        </p>
                        <p className="text-xs text-green-600 mt-1 break-words">
                          {gemstone[level.key]}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-500">Belum ada data</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-900">
                Ringkasan Level
              </h4>
            </div>
            <p className="text-sm text-blue-800">{getSummaryMessage()}</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GemstoneLevelCard;
