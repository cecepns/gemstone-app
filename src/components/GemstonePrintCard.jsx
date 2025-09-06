// ANCHOR: GemstonePrintCard Component - Print-friendly gemstone card/memo
import { Gem, Star } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';

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
    level_1_color: '#3B82F6',
    level_2_color: '#10B981',
    level_3_color: '#F59E0B',
    level_4_color: '#EF4444',
    level_5_color: '#8B5CF6',
  });

  const websiteUrl = window.location.origin;

  const currentLevel = useMemo(() => {
    // Data fields yang menjadi acuan level
    const levelFields = ['rough_seller', 'cutter', 'polisher', 'first_seller', 'gemologist_lab'];

    // Hitung jumlah data yang sudah diisi
    const completedData = levelFields.filter(field =>
      gemstone[field] && gemstone[field].trim() !== '',
    ).length;

    return completedData;
  }, [gemstone]);

  const currentLevelColor = useMemo(() => {
    return settings[`level_${currentLevel}_color`] || '#818283';
  }, [currentLevel, settings]);

  /**
   * Render star icons based on current level
   * @returns {React.ReactElement} - Star icons component
   */
  const renderLevelStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`print-level-star ${i <= currentLevel ? 'filled' : 'empty'}`}
          style={{
            color: '#FFD700',
            fill: i <= currentLevel ? '#FFD700' : 'none',
          }}
        />,
      );
    }
    return <div className="print-level-stars">{stars}</div>;
  };

  const loadSettings = async() => {
    try {
      const response = await getPublicSettings();
      const settingsData = response.data;

      setSettings({
        email: settingsData.email || '',
        phone: settingsData.phone || '',
        instagram: settingsData.instagram || '@gemstonestory',
        level_1_color: settingsData.level_1_color || '#3B82F6',
        level_2_color: settingsData.level_2_color || '#10B981',
        level_3_color: settingsData.level_3_color || '#F59E0B',
        level_4_color: settingsData.level_4_color || '#EF4444',
        level_5_color: settingsData.level_5_color || '#8B5CF6',
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

  console.log('Gemstone:', gemstone);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

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
        <div className="print-top-header" style={{ backgroundColor: currentLevelColor }}>
          <div className="print-report-title">MEMO</div>
          <div className="print-lab-logo">
            <div className="print-lab-name">Sistem Verifikasi Batu Mulia</div>
          </div>
        </div>

        <div className="print-card-content">
          {/* Left side - Image and Barcode */}
          <div className="print-left-side">
            <div className="print-report-number" style={{ color: currentLevelColor }}>
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
          <div className="print-right-side space-y-4">
            <div className="print-details">
              <div className="print-detail-item">
                <span className="print-detail-label" style={{ color: currentLevelColor }}>Date:</span>
                <span className="print-detail-value">{formatDate(gemstone.created_at)}</span>
              </div>

              <div className="print-detail-item">
                <span className="print-detail-label" style={{ color: currentLevelColor }}>Identification:</span>
                <span className="print-detail-value">{gemstone.name || 'Natural Gemstone'}</span>
              </div>

              <div className="print-detail-item">
                <span className="print-detail-label" style={{ color: currentLevelColor }}>Color:</span>
                <span className="print-detail-value">{gemstone.color || 'Tidak tersedia'}</span>
              </div>

              <div className="print-detail-item">
                <span className="print-detail-label" style={{ color: currentLevelColor }}>Weight:</span>
                <span className="print-detail-value">
                  {gemstone.weight_carat ? `${gemstone.weight_carat} ct` : 'Tidak tersedia'}
                </span>
              </div>

              <div className="print-detail-item">
                <span className="print-detail-label" style={{ color: currentLevelColor }}>Dimensions:</span>
                <span className="print-detail-value">{gemstone.dimensions_mm || 'Tidak tersedia'}</span>
              </div>

              <div className="print-detail-item">
                <span className="print-detail-label" style={{ color: currentLevelColor }}>Origin:</span>
                <span className="print-detail-value">{gemstone.origin || 'Tidak tersedia'}</span>
              </div>
            </div>

            {renderLevelStars()}

          </div>
        </div>

        {/* Bottom Footer */}
        <div className="print-bottom-footer" style={{ backgroundColor: currentLevelColor }}>
          <div className="print-social-media">
            <span>{settings.instagram}</span>
          </div>
          <div className="print-website">{websiteUrl}</div>
        </div>
      </div>

      {/* Back Card */}
      <div className="print-card print-card-back">
        {/* Back Header */}
        <div className="print-top-header" style={{ backgroundColor: currentLevelColor }}>
          <div className="print-report-title">INFORMASI TAMBAHAN</div>
          <div className="print-lab-logo">
            <div className="print-lab-name">Sistem Verifikasi Batu Mulia</div>
          </div>
        </div>

        {/* Back Content */}
        <div className="print-back-content">
          <div className="print-back-section" style={{ borderLeftColor: currentLevelColor }}>
            <h3 className="print-back-section-title" style={{ color: currentLevelColor }}>Keamanan & Verifikasi</h3>
            <div className="print-back-info">
              <p>• QR Code unik untuk verifikasi</p>
              <p>• Nomor ID: {gemstone.unique_id_number}</p>
              <p>• Scan QR atau kunjungi {websiteUrl}</p>
            </div>
          </div>

          <div className="print-back-section" style={{ borderLeftColor: currentLevelColor }}>
            <h3 className="print-back-section-title" style={{ color: currentLevelColor }}>Kontak</h3>
            <div className="print-back-info">
              {settings.email && <p>Email: {settings.email}</p>}
              {settings.phone && <p>WA: {settings.phone} | IG: {settings.instagram}</p>}
              {!settings.email && !settings.phone && (
                <p>Kontak belum dikonfigurasi</p>
              )}
            </div>
          </div>

          <div className="print-back-section" style={{ borderLeftColor: currentLevelColor }}>
            <h3 className="print-back-section-title" style={{ color: currentLevelColor }}>Disclaimer</h3>
            <div className="print-back-info">
              <p>
                Kartu ini diverifikasi laboratorium terakreditasi dan berlaku sebagai sertifikat keaslian batu mulia.
              </p>
            </div>
          </div>
        </div>

        {/* Back Footer */}
        <div className="print-bottom-footer" style={{ backgroundColor: currentLevelColor }}>
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
