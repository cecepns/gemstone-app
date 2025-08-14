// ANCHOR: PrintPreviewModal Component - Preview gemstone print card before printing
import html2pdf from 'html2pdf.js';
import { X, Printer, Download, Loader2, Image } from 'lucide-react';
import React, { useRef, useState } from 'react';

import { showError } from '../utils/toast';

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
    console.log('Printing...');
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
        margin: [20, 20, 20, 20],
        filename: `gemstone-${gemstone?.unique_id_number || 'card'}.pdf`,
        image: { type: 'jpeg', quality: 1 },
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

    } catch (_error) {
      showError('Terjadi kesalahan saat mengunduh PDF. Silakan coba lagi.');
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

      // Import html2canvas dynamically to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;

      // Get the card container
      const cardContainer = printCardRef.current;

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
      };

      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 200));

      const frontCanvas = await html2canvas(frontCard, canvasOptions);
      const frontImageData = frontCanvas.toDataURL('image/png', 1.0);

      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 200));

      const backCanvas = await html2canvas(backCard, canvasOptions);
      const backImageData = backCanvas.toDataURL('image/png', 1.0);

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
    } catch {
      showError('Terjadi kesalahan saat mengunduh gambar. Silakan coba lagi.');
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
      <Modal.Header onClose={onClose}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Preview Kartu Batu Mulia
            </h2>
            <p className="text-sm text-gray-600">
              {gemstone?.name || 'Batu Mulia'}
            </p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="p-0">
        <div className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-200">
          {/* Visible scaled preview */}
          <div className="print-preview-viewport">
            <div className="print-preview-content ">
              <GemstonePrintCard gemstone={gemstone} />
            </div>
          </div>

          {/* Off-screen original size container for export */}
          <div
            className="print-source"
          >
            <div ref={printCardRef}>
              <GemstonePrintCard gemstone={gemstone} />
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full justify-end">
          <Button
            variant="outline"
            onClick={handleDownloadImages}
            disabled={isGeneratingImages}
            className="flex items-center gap-2 w-full sm:w-auto"
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
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            {isGeneratingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
          </Button>
          <Button
            variant="primary"
            onClick={handlePrint}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Printer className="w-4 h-4" />
            Cetak Sekarang
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PrintPreviewModal;
