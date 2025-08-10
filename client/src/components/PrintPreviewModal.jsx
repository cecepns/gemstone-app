// ANCHOR: PrintPreviewModal Component - Preview gemstone print card before printing
import { X, Printer, Download } from 'lucide-react';
import React from 'react';

import GemstonePrintCard from './GemstonePrintCard';
import { Modal, Button } from './ui';

/**
 * PrintPreviewModal component - Preview and print gemstone card
 * Shows a preview of the print card and provides print/download options
 *
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Function to close modal
 * @param {Object} gemstone - Gemstone data to print
 * @returns {React.ReactElement} - Rendered print preview modal
 */
const PrintPreviewModal = ({ isOpen, onClose, gemstone }) => {
  /**
   * Handle print action
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Handle download as PDF (placeholder for future implementation)
   */
  const handleDownload = () => {
    // TODO: Implement PDF download functionality
    alert('Fitur download PDF akan segera tersedia');
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
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
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
          <GemstonePrintCard gemstone={gemstone} />
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
