// ANCHOR: GemstoneSpecifications Component - Shared component for displaying gemstone specifications
import {
  FileText,
  Calendar,
  Weight,
  Palette,
  MapPin,
  Settings,
  IdCard,
} from 'lucide-react';

import { formatDate, formatDateEnglish } from '../../utils/dateUtils';

/**
 * GemstoneSpecifications component - Display gemstone specifications in a consistent format
 * Used in both admin detail view and public verification view
 *
 * @param {Object} gemstone - Gemstone data object
 * @param {Object} options - Display options
 * @param {boolean} options.showUniqueId - Whether to show unique ID section
 * @param {boolean} options.showDescription - Whether to show description section
 * @param {boolean} options.showTreatment - Whether to show treatment section
 * @param {boolean} options.showCreatedDate - Whether to show created date section
 * @param {Function} options.onCopyId - Callback for copy ID action (optional)
 * @param {boolean} options.isCopied - Whether ID is currently copied (optional)
 * @param {boolean} options.useEnglishDate - Whether to use English date format (for public verification)
 * @param {string} options.className - Additional CSS classes
 * @returns {React.ReactElement} - Rendered gemstone specifications
 */
const GemstoneSpecifications = ({
  gemstone,
  options = {},
  className = '',
}) => {
  const {
    showUniqueId = true,
    showDescription = true,
    showTreatment = true,
    showCreatedDate = true,
    onCopyId,
    isCopied = false,
    useEnglishDate = false,
  } = options;

  // Choose date formatter based on options
  const dateFormatter = useEnglishDate ? formatDateEnglish : formatDate;

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Unique ID */}
      {showUniqueId && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
            <IdCard className="w-4 h-4" />
            Nomor ID Unik
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <p className="text-sm sm:text-lg text-purple-600 font-mono bg-purple-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-purple-200 flex-1 break-all">
              {gemstone.unique_id_number}
            </p>
            {onCopyId && (
              <button
                onClick={onCopyId}
                title="Salin ID"
                className="text-purple-600 border border-purple-200 hover:bg-purple-50 px-3 py-2 rounded-xl transition-colors duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {isCopied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Tersalin</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Salin</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {showDescription && gemstone.description && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Deskripsi
          </label>
          <p className="text-gray-900 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 text-sm sm:text-base">
            {gemstone.description}
          </p>
        </div>
      )}

      {/* Specifications grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Weight */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
            <Weight className="w-4 h-4" />
            Berat
          </label>
          <p className="text-gray-900 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 text-sm sm:text-base">
            {gemstone.weight_carat ? (
              <span className="inline-flex items-center">
                <span className="font-semibold">{gemstone.weight_carat}</span>
              </span>
            ) : (
              'Tidak tersedia'
            )}
          </p>
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
            </svg>
            Dimensi
          </label>
          <p className="text-gray-900 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 text-sm sm:text-base">
            {gemstone.dimensions_mm || 'Tidak tersedia'}
          </p>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Warna
          </label>
          <p className="text-gray-900 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 text-sm sm:text-base">
            {gemstone.color || 'Tidak tersedia'}
          </p>
        </div>

        {/* Origin */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Asal
          </label>
          <p className="text-gray-900 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 text-sm sm:text-base">
            {gemstone.origin || 'Tidak tersedia'}
          </p>
        </div>
      </div>

      {/* Treatment */}
      {showTreatment && gemstone.treatment && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Perawatan
          </label>
          <p className="text-gray-900 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 text-sm sm:text-base">
            {gemstone.treatment}
          </p>
        </div>
      )}

      {/* Created date */}
      {showCreatedDate && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Tanggal Ditambahkan
          </label>
          <p className="text-gray-900 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 text-sm sm:text-base">
            {dateFormatter(gemstone.created_at)}
          </p>
        </div>
      )}
    </div>
  );
};

export default GemstoneSpecifications;
