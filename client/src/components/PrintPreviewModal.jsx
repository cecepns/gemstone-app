// ANCHOR: PrintPreviewModal Component - Preview gemstone print card before printing
import html2pdf from 'html2pdf.js';
import { X, Printer, Download, Loader2, Image } from 'lucide-react';
import React, { useRef, useState } from 'react';

import GemstonePrintCard from './GemstonePrintCard';
import { Modal, Button } from './ui';

/**
 * PrintPreviewModal component - Preview and print gemstone card
 * Shows a preview of the print card and provides print/download options
 *
 * Features:
 * - Preview gemstone card in both front and back views
 * - Print functionality using browser print dialog
 * - PDF download functionality using html2pdf.js
 * - Image download functionality for both front and back cards
 * - Loading states and error handling
 *
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Function to close modal
 * @param {Object} gemstone - Gemstone data to print
 * @returns {React.ReactElement} - Rendered print preview modal
 */
const PrintPreviewModal = ({ isOpen, onClose, gemstone }) => {
  const printCardRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  /**
   * Handle print action
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Handle download as PDF
   */
  const handleDownload = async() => {
    if (!printCardRef.current) {
      return;
    }

    try {
      setIsGeneratingPDF(true);

      // Wait a bit for any images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // PDF options
      const options = {
        margin: [10, 10, 10, 10],
        filename: `gemstone-${gemstone?.unique_id_number || 'card'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
      };

      // Generate PDF
      await html2pdf()
        .from(printCardRef.current)
        .set(options)
        .save();

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat mengunduh PDF. Silakan coba lagi.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  /**
   * Handle download as images (front and back cards)
   */
  const handleDownloadImages = async() => {
    if (!printCardRef.current) {
      return;
    }

    try {
      setIsGeneratingImages(true);

      // Wait a bit for any images to load and ensure proper rendering
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ensure all images are loaded
      const images = cardContainer.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) {
            return Promise.resolve();
          }
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }),
      );

      // Import html2canvas dynamically to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;

      // Get the card container
      const cardContainer = printCardRef.current;
      const frontCard = cardContainer.querySelector('.print-card:not(.print-card-back)');
      const backCard = cardContainer.querySelector('.print-card-back');

      if (!frontCard || !backCard) {
        throw new Error('Card elements not found');
      }

      // Get exact dimensions from the original cards
      const cardWidth = frontCard.offsetWidth;
      const cardHeight = frontCard.offsetHeight;

      // Canvas options for high quality and precise sizing
      const canvasOptions = {
        scale: 3, // Higher scale for better precision
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        letterRendering: true,
        width: cardWidth,
        height: cardHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: cardWidth,
        windowHeight: cardHeight,
        foreignObjectRendering: false,
        removeContainer: true,
        ignoreElements: (element) => {
          // Ignore any hidden elements
          return element.style.display === 'none' ||
                 element.style.visibility === 'hidden' ||
                 element.classList.contains('print-card-toggle');
        },
      };

      // Create temporary container with exact positioning
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = `${cardWidth}px`;
      tempContainer.style.height = `${cardHeight}px`;
      tempContainer.style.overflow = 'hidden';
      tempContainer.style.backgroundColor = '#ffffff';
      document.body.appendChild(tempContainer);

      // Clone and capture front card with exact styling
      const frontClone = frontCard.cloneNode(true);
      frontClone.classList.add('print-card-for-capture');
      frontClone.classList.remove('print-card-hidden');
      frontClone.style.width = `${cardWidth}px`;
      frontClone.style.height = `${cardHeight}px`;
      tempContainer.appendChild(frontClone);

      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 200));

      const frontCanvas = await html2canvas(frontClone, canvasOptions);
      const frontImageData = frontCanvas.toDataURL('image/png', 1.0);

      // Clear container and clone back card with exact styling
      tempContainer.innerHTML = '';
      const backClone = backCard.cloneNode(true);
      backClone.classList.add('print-card-for-capture');
      backClone.classList.remove('print-card-hidden');
      backClone.style.width = `${cardWidth}px`;
      backClone.style.height = `${cardHeight}px`;
      tempContainer.appendChild(backClone);

      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 200));

      const backCanvas = await html2canvas(backClone, canvasOptions);
      const backImageData = backCanvas.toDataURL('image/png', 1.0);

      // Clean up temporary container
      document.body.removeChild(tempContainer);

      // Create download links
      const frontLink = document.createElement('a');
      frontLink.href = frontImageData;
      frontLink.download = `gemstone-${gemstone?.unique_id_number || 'card'}-front.png`;
      document.body.appendChild(frontLink);
      frontLink.click();
      document.body.removeChild(frontLink);

      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 100));

      const backLink = document.createElement('a');
      backLink.href = backImageData;
      backLink.download = `gemstone-${gemstone?.unique_id_number || 'card'}-back.png`;
      document.body.appendChild(backLink);
      backLink.click();
      document.body.removeChild(backLink);

      // Show success message
      console.log('Images downloaded successfully');
    } catch (error) {
      console.error('Error generating images:', error);
      alert('Terjadi kesalahan saat mengunduh gambar. Silakan coba lagi.');
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className="max-w-7xl"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Preview Kartu Batu Mulia
            </h2>
            <p className="text-sm text-gray-600">
              {gemstone?.name || 'Batu Mulia'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleDownloadImages}
              disabled={isGeneratingImages}
              className="flex items-center gap-2"
            >
              {isGeneratingImages ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Image className="w-4 h-4" />
              )}
              {isGeneratingImages ? 'Generating Images...' : 'Download Images'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              iconOnly
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto bg-gray-200">
          <div ref={printCardRef} className="pdf-container">
            <GemstonePrintCard gemstone={gemstone} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Tutup
              </Button>
              <Button
                variant="primary"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PrintPreviewModal;
