// ANCHOR: Toast Notification Utilities
import toast from 'react-hot-toast'

/**
 * Show success toast notification
 * @param {string} message - Success message to display
 */
export const showSuccess = (message) => {
  toast.success(message)
}

/**
 * Show error toast notification
 * @param {string} message - Error message to display
 */
export const showError = (message) => {
  toast.error(message)
}

/**
 * Show loading toast notification
 * @param {string} message - Loading message to display
 * @returns {string} - Toast ID for dismissing
 */
export const showLoading = (message = 'Loading...') => {
  return toast.loading(message)
}

/**
 * Show info toast notification
 * @param {string} message - Info message to display
 */
export const showInfo = (message) => {
  toast(message, {
    icon: 'ℹ️',
  })
}

/**
 * Dismiss specific toast by ID
 * @param {string} toastId - Toast ID to dismiss
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId)
}

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss()
}

/**
 * Show promise toast - automatically handles loading, success, and error states
 * @param {Promise} promise - Promise to handle
 * @param {Object} messages - Object containing loading, success, and error messages
 * @returns {Promise} - The original promise
 */
export const showPromise = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong!',
    }
  )
}
