// ANCHOR: DeleteConfirmationModal Component - Reusable delete confirmation modal
import { AlertCircle } from 'lucide-react';
import { Modal, Button } from './ui';

/**
 * DeleteConfirmationModal - Reusable component for delete confirmation
 * Handles the display and logic for confirming deletion of items
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onConfirm - Function to execute when delete is confirmed
 * @param {string} props.itemName - Name of the item to delete (optional)
 * @param {string} props.itemType - Type of item being deleted (default: "item")
 * @param {string} props.title - Modal title (optional)
 * @param {string} props.description - Modal description (optional)
 * @param {string} props.warningMessage - Custom warning message (optional)
 * @returns {React.ReactElement} - Rendered delete confirmation modal
 */
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = "item",
  title = "Delete Confirmation",
  description = "This action cannot be undone",
  warningMessage = "This will permanently delete the item and all associated data."
}) => {
  /**
   * Handle confirm button click
   */
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header onClose={onClose}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              "{itemName || `this ${itemType}`}"
            </span>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Warning:</p>
                <p>{warningMessage}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          className="rounded-xl"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          className="rounded-xl"
        >
          Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal; 