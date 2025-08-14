// ANCHOR: GemstonePrintCard Component - Print-friendly gemstone card/memo
import { Gem } from 'lucide-react';
import React from 'react';

/**
 * GemstonePrintCard component - Print-friendly gemstone information card
 * Displays basic gemstone information, image, and QR code in a card format
 * Includes front and back card views with toggle functionality
 *
 * @param {Object} gemstone - Gemstone data object
 * @returns {React.ReactElement} - Rendered print card
 */
const GemstonePrintCard = ({ gemstone }) => {

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!gemstone) {
    return (
      <div className="print-card">
        <div className="print-card-content">
          <p>Tidak ada data batu mulia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="print-card-container">

      <div className="print-card">
        <div className="print-top-header">
          <div className="print-report-title">REPORT</div>
          <div className="print-lab-logo">
            <div className="print-lab-name">Sistem Verifikasi Batu Mulia</div>
          </div>
        </div>

        <div className="print-card-content">
          {/* Left side - Image and Barcode */}
          <div className="print-left-side">
            <div className="print-report-number">
              No: {gemstone.unique_id_number}
            </div>

            <div className="print-image-container">
              {gemstone.photo_url ? (
                <img
                  src={gemstone.photo_url}
                  alt={gemstone.name || 'Batu Mulia'}
                  className="print-image"
                />
              ) : (
                <div className="print-image-placeholder">
                  <Gem className="print-placeholder-icon" />
                  <p>Tidak ada gambar</p>
                </div>
              )}
            </div>

            <div className="print-barcode-container">
              {gemstone.qr_code_data_url ? (
                <img
                  src={gemstone.qr_code_data_url}
                  alt="Barcode"
                  className="print-barcode"
                />
              ) : (
                <div className="print-barcode-placeholder">
                  <p>Barcode</p>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Gemstone Details */}
          <div className="print-right-side">
            <div className="print-details">
              <div className="print-detail-item">
                <span className="print-detail-label">Date:</span>
                <span className="print-detail-value">{formatDate(gemstone.created_at)}</span>
              </div>

              <div className="print-detail-item">
                <span className="print-detail-label">Identification:</span>
                <span className="print-detail-value">{gemstone.name || 'Natural Gemstone'}</span>
              </div>

              <div className="print-detail-item">
                <span className="print-detail-label">Color:</span>
                <span className="print-detail-value">{gemstone.color || 'Tidak tersedia'}</span>
              </div>

              <div className="print-detail-item">
                <span className="print-detail-label">Weight:</span>
                <span className="print-detail-value">
                  {gemstone.weight_carat ? `${gemstone.weight_carat} ct` : 'Tidak tersedia'}
                </span>
              </div>

              <div className="print-detail-item">
                <span className="print-detail-label">Dimensions:</span>
                <span className="print-detail-value">{gemstone.dimensions_mm || 'Tidak tersedia'}</span>
              </div>

              <div className="print-detail-item">
                <span className="print-detail-label">Origin:</span>
                <span className="print-detail-value">{gemstone.origin || 'Tidak tersedia'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="print-bottom-footer">
          <div className="print-social-media">
            <span>@gemstonestory</span>
          </div>
          <div className="print-website">gemstonestory.id</div>
        </div>
      </div>

      {/* Back Card */}
      <div className="print-card print-card-back">
        {/* Back Header */}
        <div className="print-top-header">
          <div className="print-report-title">INFORMASI TAMBAHAN</div>
          <div className="print-lab-logo">
            <div className="print-lab-name">Sistem Verifikasi Batu Mulia</div>
          </div>
        </div>

        {/* Back Content */}
        <div className="print-back-content">
          <div className="print-back-section">
            <h3 className="print-back-section-title">Keamanan & Verifikasi</h3>
            <div className="print-back-info">
              <p>• QR Code unik untuk verifikasi</p>
              <p>• Nomor ID: {gemstone.unique_id_number}</p>
              <p>• Scan QR atau kunjungi gemstonestory.id</p>
            </div>
          </div>

          <div className="print-back-section">
            <h3 className="print-back-section-title">Kontak</h3>
            <div className="print-back-info">
              <p>Email: info@gemstonestory.net</p>
              <p>WA: +62 812-3456-7890 | IG: @gemstonestory</p>
            </div>
          </div>

          <div className="print-back-section">
            <h3 className="print-back-section-title">Disclaimer</h3>
            <div className="print-back-info">
              <p>
                Kartu ini diverifikasi laboratorium terakreditasi dan berlaku sebagai sertifikat keaslian batu mulia.
              </p>
            </div>
          </div>
        </div>

        {/* Back Footer */}
        <div className="print-bottom-footer">
          <div className="print-social-media">
            <span>@gemstonestory</span>
          </div>
          <div className="print-website">gemstonestory.id</div>
        </div>
      </div>
    </div>
  );
};

export default GemstonePrintCard;
