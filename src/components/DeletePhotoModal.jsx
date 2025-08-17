import React from 'react';

import Button from './ui/Button';
import Modal from './ui/Modal';

const DeletePhotoModal = ({ isOpen, onClose, onConfirm, photoName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Foto">
      <div className="space-y-4 p-4">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Hapus Foto
          </h3>
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          {photoName && (
            <p className="text-xs text-gray-500 mt-1">
              File: {photoName}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={onConfirm}
            variant="danger"
            className="flex-1"
          >
            Hapus
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePhotoModal;
