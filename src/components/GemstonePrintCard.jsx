// ANCHOR: GemstonePrintCard Component - Print-friendly gemstone card/memo
import { Gem } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { getPublicSettings } from '../utils/api';

/**
 * GemstonePrintCard component - Print-friendly gemstone information card
 * Displays basic gemstone information, image, and QR code in a card format
 * Includes front and back card views with toggle functionality
 *
 * @param {Object} gemstone - Gemstone data object
 * @returns {React.ReactElement} - Rendered print card
 */
const GemstonePrintCard = ({ gemstone }) => {
  const [settings, setSettings] = useState({
    email: '',
    phone: '',
    instagram: '@gemstonestory',
  });

  const websiteUrl = window.location.origin;

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async() => {
    try {
      const response = await getPublicSettings();
      const settingsData = response.data;

      setSettings({
        email: settingsData.email || '',
        phone: settingsData.phone || '',
        instagram: settingsData.instagram || '@gemstonestory',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      // Keep default values if loading fails
    }
  };

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
      timeZone: 'Asia/Jakarta',
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
          <div className="print-report-title">MEMO</div>
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
            <span>{settings.instagram}</span>
          </div>
          <div className="print-website">{websiteUrl}</div>
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
              <p>• Scan QR atau kunjungi {websiteUrl}</p>
            </div>
          </div>

          <div className="print-back-section">
            <h3 className="print-back-section-title">Kontak</h3>
            <div className="print-back-info">
              {settings.email && <p>Email: {settings.email}</p>}
              {settings.phone && <p>WA: {settings.phone} | IG: {settings.instagram}</p>}
              {!settings.email && !settings.phone && (
                <p>Kontak belum dikonfigurasi</p>
              )}
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
            <span>{settings.instagram}</span>
          </div>
          <div className="print-website">{websiteUrl}</div>
        </div>
      </div>
    </div>
  );
};

export default GemstonePrintCard;
