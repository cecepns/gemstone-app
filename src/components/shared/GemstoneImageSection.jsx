// ANCHOR: GemstoneImageSection Component - Shared component for displaying gemstone image and QR code
import { Gem, FileText } from 'lucide-react';

/**
 * GemstoneImageSection component - Display gemstone image and QR code in a consistent format
 * Used in both admin detail view and public verification view
 *
 * @param {Object} gemstone - Gemstone data object
 * @param {Object} options - Display options
 * @param {boolean} options.showQRCode - Whether to show QR code section
 * @param {string} options.className - Additional CSS classes
 * @returns {React.ReactElement} - Rendered gemstone image section
 */
const GemstoneImageSection = ({
  gemstone,
  options = {},
  className = '',
}) => {
  const {
    showQRCode = true,
  } = options;

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Gemstone image */}
      <div>
        {gemstone.photo_url ? (
          <div className="relative">
            <img
              src={gemstone.photo_url}
              alt={gemstone.name || 'Batu Mulia'}
              className="w-full aspect-square object-cover rounded-xl border border-gray-200 shadow-lg"
            />
          </div>
        ) : (
          <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Gem className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm sm:text-base text-gray-500">Tidak ada gambar tersedia</p>
            </div>
          </div>
        )}
      </div>

      {/* QR Code */}
      {showQRCode && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Kode QR
          </h3>
          {gemstone.qr_code_data_url ? (
            <div className="flex justify-center p-6 sm:p-12">
              <img
                src={gemstone.qr_code_data_url}
                alt="Kode QR"
                className="w-32 h-32 sm:w-48 sm:h-48 border border-gray-200 rounded-xl shadow-lg"
              />
            </div>
          ) : (
            <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center mx-auto">
              <div className="text-center">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-xs sm:text-sm">Tidak ada kode QR</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GemstoneImageSection;
