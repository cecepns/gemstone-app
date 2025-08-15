// ANCHOR: AddEditOwnerModal Component - Modal for adding or editing gemstone owners
import {
  UserPlus,
  Edit,
  X,
  AlertCircle,
  Copy,
  Users,
} from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';

import { useAuth } from '../context/AuthContext';
import { addGemstoneOwner, updateGemstoneOwner, getGemstoneOwners, getAllOwners } from '../utils/api';
import { formatDateForInput, formatDateForDisplay, getCurrentDate } from '../utils/dateUtils';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';

import { Button, Input, Textarea, Modal, Checkbox, Select } from './ui';

/**
 * AddEditOwnerModal component - Modal for adding or editing gemstone owners
 *
 * Features:
 * - Add new owner with transfer option
 * - Edit existing owner data
 * - Template selection: Use existing owner data as template for new owner
 * - Visual indicators for template-filled fields
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close modal function
 * @param {Function} props.onSuccess - Success callback function
 * @param {string} props.gemstoneId - Gemstone ID
 * @param {string} props.gemstoneName - Gemstone name for display
 * @param {Object|null} props.editingOwner - Owner data to edit (null for add mode)
 * @returns {React.ReactElement} - Rendered modal component
 */
const AddEditOwnerModal = ({ isOpen, onClose, onSuccess, gemstoneId, gemstoneName, editingOwner }) => {
  const { getAuthHeader } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    owner_address: '',
    ownership_start_date: '',
    ownership_end_date: '',
    notes: '',
    is_transfer: false,
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Template selector state
  const [availableOwners, setAvailableOwners] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [hasCurrentOwner, setHasCurrentOwner] = useState(false);

  // Existing owners data for validation
  const [existingOwners, setExistingOwners] = useState([]);
  const [currentOwner, setCurrentOwner] = useState(null);

  // Constraints are computed via useMemo to avoid stale state

  /**
   * Get valid date range for adding new owner
   * @param {boolean} isTransfer - Whether this is a transfer mode
   * @returns {Object} - Object with minDate and maxDate
   */
  const getValidDateRangeForAdd = useCallback((isTransfer) => {
    // Ensure we have the active owner source of truth
    const activeOwner = currentOwner || existingOwners.find(owner => owner.is_current_owner) || null;

    if (isTransfer && activeOwner && activeOwner.ownership_start_date) {
      // Transfer mode: tgl mulai tidak boleh kurang dari tgl mulai pemilik aktif saat ini
      return {
        minStartDate: activeOwner.ownership_start_date,
        maxStartDate: null,
        minEndDate: null,
        maxEndDate: null,
      };
    } else if (!isTransfer && existingOwners.length > 0) {
      // Add historical owner: tgl berakhir dan tgl mulai tidak boleh lebih dari tgl mulai pemilik pertama
      const firstOwner = existingOwners[0];
      return {
        minStartDate: null,
        maxStartDate: firstOwner.ownership_start_date,
        minEndDate: null,
        maxEndDate: firstOwner.ownership_start_date,
      };
    }

    return {
      minStartDate: null,
      maxStartDate: null,
      minEndDate: null,
      maxEndDate: null,
    };
  }, [currentOwner, existingOwners]);

  /**
   * Get valid date range for editing existing owner
   * @param {Object} owner - Owner being edited
   * @returns {Object} - Object with minDate and maxDate
   */
  const getValidDateRangeForEdit = useCallback((owner) => {
    if (!owner || !existingOwners.length) {
      return {
        minStartDate: null,
        maxStartDate: null,
        minEndDate: null,
        maxEndDate: null,
      };
    }

    // Find owner's position in the sorted list
    const ownerIndex = existingOwners.findIndex(o => o.id === owner.id);
    const previousOwner = ownerIndex > 0 ? existingOwners[ownerIndex - 1] : null;
    const nextOwner = ownerIndex < existingOwners.length - 1 ? existingOwners[ownerIndex + 1] : null;

    let minStartDate = null;
    let maxStartDate = null;
    const minEndDate = null;
    let maxEndDate = null;

    // Constraints based on previous owner
    if (previousOwner) {
      minStartDate = previousOwner.ownership_start_date;
    }

    // Constraints based on next owner
    if (nextOwner) {
      maxEndDate = nextOwner.ownership_start_date;
      // Tambahkan batasan maksimal tanggal mulai berdasarkan tanggal berakhir pemilik saat ini
      if (owner.ownership_end_date) {
        maxStartDate = owner.ownership_end_date;
      }
    }

    // Special constraints for current owner
    if (owner.is_current_owner) {
      // Current owner: tgl mulai tidak boleh kurang dari tgl berakhir pemilik sebelumnya
      if (previousOwner) {
        // Debug removed to satisfy linter and avoid noisy logs
        minStartDate = previousOwner.ownership_end_date || previousOwner.ownership_start_date;
      }
    } else {
      // Former owner: tgl berakhir tidak boleh lebih dari hari ini
      const today = new Date().toISOString().split('T')[0];
      maxEndDate = maxEndDate ? (maxEndDate < today ? maxEndDate : today) : today;
    }

    return {
      minStartDate,
      maxStartDate,
      minEndDate,
      maxEndDate,
    };
  }, [existingOwners]);

  // Compute fresh constraints based on latest state (placed before validators to avoid TDZ)
  const dateConstraints = useMemo(() => {
    if (editingOwner) {
      return getValidDateRangeForEdit(editingOwner);
    }
    return getValidDateRangeForAdd(formData.is_transfer);
  }, [editingOwner, formData.is_transfer, getValidDateRangeForAdd, getValidDateRangeForEdit]);

  /**
   * Fetch available owners for template selection
   */
  const fetchAvailableOwners = async() => {
    try {
      setIsLoadingTemplates(true);
      const result = await getAllOwners(getAuthHeader());
      setAvailableOwners(result.data || []);
    } catch {
      setAvailableOwners([]);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  /**
   * Check if current gemstone has an active owner and fetch existing owners data
   */
  const checkCurrentOwner = async() => {
    try {
      const result = await getGemstoneOwners(gemstoneId, getAuthHeader());
      const owners = result.data || [];

      // Sort owners by ownership_start_date (oldest first)
      const sortedOwners = owners.sort((a, b) => {
        return new Date(a.ownership_start_date) - new Date(b.ownership_start_date);
      });

      setExistingOwners(sortedOwners);

      const currentOwnerData = owners.find(owner => owner.is_current_owner);
      setCurrentOwner(currentOwnerData);
      setHasCurrentOwner(!!currentOwnerData);
    } catch {
      setHasCurrentOwner(false);
      setExistingOwners([]);
      setCurrentOwner(null);
    }
  };

  /**
   * Handle template selection
   * @param {string} ownerId - Selected owner ID
   */
  const handleTemplateSelect = (ownerId) => {
    if (!ownerId) {
      setSelectedTemplate('');
      return;
    }

    // Find the selected owner with safe string comparison to handle number/string IDs
    const selectedOwner = availableOwners.find(owner => {
      return String(owner.id) === String(ownerId);
    });

    if (selectedOwner) {
      setSelectedTemplate(ownerId);

      // Update form data immediately
      setFormData(prev => {
        const newData = {
          ...prev,
          owner_name: selectedOwner.owner_name || '',
          owner_phone: selectedOwner.owner_phone || '',
          owner_email: selectedOwner.owner_email || '',
          owner_address: selectedOwner.owner_address || '',
          notes: selectedOwner.notes || '',
          // Keep current dates and transfer mode unchanged
          ownership_start_date: prev.ownership_start_date,
          ownership_end_date: prev.ownership_end_date,
          is_transfer: prev.is_transfer,
        };

        return newData;
      });

      // Clear errors for filled fields
      setErrors(prev => ({
        ...prev,
        owner_name: '',
        owner_phone: '',
        owner_email: '',
      }));

    }
  };

  /**
   * Clear template selection and reset form
   */
  const clearTemplate = () => {
    setSelectedTemplate('');
    resetForm();
  };

  /**
   * Reset form data
   */
  const resetForm = () => {
    setFormData({
      owner_name: '',
      owner_phone: '',
      owner_email: '',
      owner_address: '',
      ownership_start_date: '',
      ownership_end_date: '',
      notes: '',
      is_transfer: false,
    });
    setErrors({});
  };

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: fieldValue,
      };

      // Reset date fields when transfer mode changes
      if (name === 'is_transfer') {
        newData.ownership_start_date = '';
        newData.ownership_end_date = '';
      }

      return newData;
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    // Handle transfer mode change - clear date validation errors and re-validate
    if (name === 'is_transfer') {
      setErrors(prev => ({
        ...prev,
        ownership_start_date: '',
        ownership_end_date: '',
      }));

      // Since dates are reset, just clear any existing date errors (constraints recompute via useMemo)
    }

    // Live-validate date fields on change using fresh constraints
    if (name === 'ownership_start_date' || name === 'ownership_end_date') {
      const nextFormData = {
        ...formData,
        [name]: fieldValue,
      };
      validateDateOnChange(nextFormData);
    }
  };

  /**
   * Live validate date fields on change (start/end) using computed constraints
   */
  const validateDateOnChange = useCallback((currentFormData) => {
    const newErrors = {};

    const startStr = currentFormData.ownership_start_date;
    const endStr = currentFormData.ownership_end_date;

    // Validate start date against min/max constraints
    if (startStr) {
      const startDate = new Date(startStr);

      if (dateConstraints.minStartDate) {
        const minDate = new Date(dateConstraints.minStartDate);
        if (startDate < minDate) {
          newErrors.ownership_start_date = `Tanggal mulai tidak boleh kurang dari ${formatDateForDisplay(dateConstraints.minStartDate)}`;
        }
      }

      if (dateConstraints.maxStartDate) {
        const maxDate = new Date(dateConstraints.maxStartDate);
        if (startDate > maxDate) {
          newErrors.ownership_start_date = `Tanggal mulai tidak boleh lebih dari ${formatDateForDisplay(dateConstraints.maxStartDate)}`;
        }
      }
    }

    // Validate end date dependencies and constraints
    if (endStr) {
      if (!startStr) {
        newErrors.ownership_start_date = 'Tanggal mulai harus dipilih terlebih dahulu sebelum mengisi tanggal berakhir';
      } else {
        const startDate = new Date(startStr);
        const endDate = new Date(endStr);
        if (endDate <= startDate) {
          newErrors.ownership_end_date = 'Tanggal berakhir harus setelah tanggal mulai';
        }
      }

      if (dateConstraints.maxEndDate) {
        const maxEnd = new Date(dateConstraints.maxEndDate);
        const endDate = new Date(endStr);
        if (endDate > maxEnd) {
          newErrors.ownership_end_date = `Tanggal berakhir tidak boleh lebih dari ${formatDateForDisplay(dateConstraints.maxEndDate)}`;
        }
      }
    }

    setErrors(prev => ({
      ...prev,
      ownership_start_date: newErrors.ownership_start_date || '',
      ownership_end_date: newErrors.ownership_end_date || '',
    }));
  }, [dateConstraints]);

  // Removed: updateDateConstraints - constraints are computed on the fly

  /**
   * Validate form data
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.owner_name.trim()) {
      newErrors.owner_name = 'Nama pemilik harus diisi';
    }

    if (!formData.owner_phone.trim()) {
      newErrors.owner_phone = 'Nomor telepon harus diisi';
    }

    if (!formData.ownership_start_date) {
      newErrors.ownership_start_date = 'Tanggal mulai kepemilikan harus diisi';
    }

    // Validate email format if provided
    if (formData.owner_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner_email)) {
      newErrors.owner_email = 'Format email tidak valid';
    }

    // Validate ownership end date for former owners (required field)
    if (editingOwner && !editingOwner.is_current_owner && !formData.ownership_end_date) {
      newErrors.ownership_end_date = 'Tanggal berakhir kepemilikan wajib diisi untuk mantan pemilik';
    }

    // Validate ownership end date for new owners (required field when not in transfer mode and there's a current owner)
    if (!editingOwner && !formData.is_transfer && hasCurrentOwner && !formData.ownership_end_date) {
      newErrors.ownership_end_date = 'Tanggal berakhir kepemilikan wajib diisi untuk menambah riwayat pemilik';
    }

    // Basic date range validation: end date must be after start date
    if (formData.ownership_end_date && formData.ownership_start_date) {
      const startDate = new Date(formData.ownership_start_date);
      const endDate = new Date(formData.ownership_end_date);

      if (endDate <= startDate) {
        newErrors.ownership_end_date = 'Tanggal berakhir harus setelah tanggal mulai';
      }
    }

    // Prevent input of end date if start date is not selected
    if (formData.ownership_end_date && !formData.ownership_start_date) {
      newErrors.ownership_start_date = 'Tanggal mulai harus dipilih terlebih dahulu sebelum mengisi tanggal berakhir';
    }

    // Advanced date validation based on scenarios
    if (formData.ownership_start_date) {
      let dateRange;

      if (editingOwner) {
        // Edit scenario
        dateRange = getValidDateRangeForEdit(editingOwner);

        // Validate start date constraints
        if (dateRange.minStartDate) {
          const minDate = new Date(dateRange.minStartDate);
          const inputDate = new Date(formData.ownership_start_date);
          if (inputDate < minDate) {
            newErrors.ownership_start_date = `Tanggal mulai tidak boleh kurang dari ${formatDateForDisplay(dateRange.minStartDate)}`;
          }
        }

        if (dateRange.maxStartDate) {
          const maxDate = new Date(dateRange.maxStartDate);
          const inputDate = new Date(formData.ownership_start_date);
          if (inputDate > maxDate) {
            newErrors.ownership_start_date = `Tanggal mulai tidak boleh lebih dari ${formatDateForDisplay(dateRange.maxStartDate)}`;
          }
        }

        // Validate end date constraints
        if (formData.ownership_end_date) {
          if (dateRange.minEndDate) {
            const minDate = new Date(dateRange.minEndDate);
            const inputDate = new Date(formData.ownership_end_date);
            if (inputDate < minDate) {
              newErrors.ownership_end_date = `Tanggal berakhir tidak boleh kurang dari ${formatDateForDisplay(dateRange.minEndDate)}`;
            }
          }

          if (dateRange.maxEndDate) {
            const maxDate = new Date(dateRange.maxEndDate);
            const inputDate = new Date(formData.ownership_end_date);
            if (inputDate > maxDate) {
              newErrors.ownership_end_date = `Tanggal berakhir tidak boleh lebih dari ${formatDateForDisplay(dateRange.maxEndDate)}`;
            }
          }
        }
      } else {
        // Add scenario
        dateRange = getValidDateRangeForAdd(formData.is_transfer);

        // Validate start date constraints for add
        if (dateRange.minStartDate) {
          const minDate = new Date(dateRange.minStartDate);
          const inputDate = new Date(formData.ownership_start_date);
          if (inputDate < minDate) {
            newErrors.ownership_start_date = `Tanggal mulai tidak boleh kurang dari ${formatDateForDisplay(dateRange.minStartDate)} ` +
              '(tanggal mulai pemilik aktif saat ini)';
          }
        }

        if (dateRange.maxStartDate) {
          const maxDate = new Date(dateRange.maxStartDate);
          const inputDate = new Date(formData.ownership_start_date);
          if (inputDate > maxDate) {
            newErrors.ownership_start_date = `Tanggal mulai tidak boleh lebih dari ${formatDateForDisplay(dateRange.maxStartDate)} (tanggal mulai pemilik pertama)`;
          }
        }

        // Validate end date constraints for add
        if (formData.ownership_end_date) {
          if (dateRange.maxEndDate) {
            const maxDate = new Date(dateRange.maxEndDate);
            const inputDate = new Date(formData.ownership_end_date);
            if (inputDate > maxDate) {
              newErrors.ownership_end_date = `Tanggal berakhir tidak boleh lebih dari ${formatDateForDisplay(dateRange.maxEndDate)} (tanggal mulai pemilik pertama)`;
            }
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      showLoading(editingOwner ? 'Memperbarui data pemilik...' : 'Menambahkan pemilik baru...');

      if (editingOwner) {
        // Prepare data for update - ensure end date is null for current owner
        const updateData = {
          ...formData,
          ownership_end_date: editingOwner.is_current_owner ? null : (formData.ownership_end_date || null),
        };

        // Update existing owner
        await updateGemstoneOwner(gemstoneId, editingOwner.id, updateData, getAuthHeader());

        // Auto-adjust related owners dates
        await autoAdjustRelatedOwners(editingOwner, updateData.ownership_start_date, updateData.ownership_end_date);

        dismissToast();
        showSuccess('Data pemilik berhasil diperbarui');
      } else {
        // Prepare data for add - ensure end date is null for transfer mode
        const addData = {
          ...formData,
          ownership_end_date: formData.is_transfer ? null : (formData.ownership_end_date || null),
        };

        // Add new owner with transfer option
        await addGemstoneOwner(gemstoneId, addData, getAuthHeader());
        dismissToast();
        showSuccess(formData.is_transfer ? 'Kepemilikan berhasil ditransfer' : 'Pemilik baru berhasil ditambahkan');
      }

      onSuccess(); // Call success callback
      onClose(); // Close modal
    } catch (error) {
      dismissToast();
      showError(error.message || 'Gagal menyimpan data pemilik');
    }
  };

  /**
   * Auto-adjust dates of related owners when editing
   * @param {Object} editedOwner - The owner that was edited
   * @param {string} newStartDate - New start date
   * @param {string} newEndDate - New end date
   */
  const autoAdjustRelatedOwners = async(editedOwner, newStartDate, newEndDate) => {
    if (!existingOwners.length || !editedOwner) {
      return;
    }

    const ownerIndex = existingOwners.findIndex(o => o.id === editedOwner.id);
    if (ownerIndex === -1) {
      return;
    }

    const updates = [];

    // Find previous and next owners
    const previousOwner = ownerIndex > 0 ? existingOwners[ownerIndex - 1] : null;
    const nextOwner = ownerIndex < existingOwners.length - 1 ? existingOwners[ownerIndex + 1] : null;

    // Auto-adjust based on edited owner position
    if (previousOwner && newStartDate) {
      // Adjust previous owner's end date to match current owner's start date
      const adjustedEndDate = formatDateForInput(newStartDate);
      if (previousOwner.ownership_end_date !== adjustedEndDate) {
        updates.push({
          owner: previousOwner,
          data: {
            owner_name: previousOwner.owner_name,
            owner_phone: previousOwner.owner_phone,
            owner_email: previousOwner.owner_email || '',
            owner_address: previousOwner.owner_address || '',
            ownership_start_date: previousOwner.ownership_start_date,
            ownership_end_date: adjustedEndDate,
            notes: previousOwner.notes || '',
          },
        });
      }
    }

    if (nextOwner && (newEndDate || editedOwner.is_current_owner)) {
      // For current owner, use current date as reference
      const referenceDate = editedOwner.is_current_owner ? getCurrentDate() : newEndDate;

      // Adjust next owner's start date to match current owner's end date
      const adjustedStartDate = formatDateForInput(referenceDate);
      if (nextOwner.ownership_start_date !== adjustedStartDate) {
        updates.push({
          owner: nextOwner,
          data: {
            owner_name: nextOwner.owner_name,
            owner_phone: nextOwner.owner_phone,
            owner_email: nextOwner.owner_email || '',
            owner_address: nextOwner.owner_address || '',
            ownership_start_date: adjustedStartDate,
            ownership_end_date: nextOwner.is_current_owner ? null : nextOwner.ownership_end_date,
            notes: nextOwner.notes || '',
          },
        });
      }
    }

    // Execute updates
    for (const update of updates) {
      try {
        await updateGemstoneOwner(gemstoneId, update.owner.id, update.data, getAuthHeader());
      } catch (_error) {
        // Silent fail - continue with other updates even if one fails
        // This prevents blocking the main operation if auto-adjust fails
      }
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    resetForm();
    setSelectedTemplate('');
    onClose();
  };

  useEffect(() => {
    if (isOpen && editingOwner) {
      const formattedStartDate = formatDateForInput(editingOwner.ownership_start_date);
      const formattedEndDate = formatDateForInput(editingOwner.ownership_end_date);
      setFormData({
        owner_name: editingOwner.owner_name || '',
        owner_phone: editingOwner.owner_phone || '',
        owner_email: editingOwner.owner_email || '',
        owner_address: editingOwner.owner_address || '',
        ownership_start_date: formattedStartDate,
        ownership_end_date: editingOwner.is_current_owner ? '' : formattedEndDate, // Clear end date for current owner
        notes: editingOwner.notes || '',
        is_transfer: false, // Reset transfer mode when editing
      });
      // Also fetch existing owners data for validation when editing
      checkCurrentOwner();
    } else if (isOpen && !editingOwner) {
      resetForm();
      setSelectedTemplate(''); // Reset template selection
      fetchAvailableOwners();
      checkCurrentOwner();
    } else if (!isOpen) {
      // Ensure template selection is cleared when modal closes
      setSelectedTemplate('');
    }

    // Constraints are computed via useMemo; no imperative updates needed here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingOwner, gemstoneId]);

  // NOTE: removed duplicate later declaration to avoid TDZ

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {editingOwner ? (
              <Edit className="w-6 h-6 text-blue-600" />
            ) : (
              <UserPlus className="w-6 h-6 text-green-600" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {editingOwner ? 'Edit Data Pemilik' : 'Tambah Pemilik Baru'}
              </h3>
              <p className="text-sm text-gray-600">{gemstoneName}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingOwner && availableOwners.length > 0 && (
            <div className={`border rounded-lg p-4 ${selectedTemplate ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <Copy className={`w-5 h-5 ${selectedTemplate ? 'text-green-600' : 'text-blue-600'}`} />
                <h4 className={`text-sm font-medium ${selectedTemplate ? 'text-green-900' : 'text-blue-900'}`}>
                  {selectedTemplate ? 'Template Dipilih' : 'Gunakan Data Pemilik Sebagai Template'}
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    disabled={isLoadingTemplates}
                    placeholder={isLoadingTemplates ? 'Memuat data pemilik...' : 'Pilih pemilik untuk digunakan sebagai template...'}
                    options={[
                      ...availableOwners.map((owner) => {
                        return {
                          value: owner.id,
                          label: `${owner.owner_name} - ${owner.owner_phone} (${owner.gemstone_name || 'Unknown Gemstone'})`,
                        };
                      }),
                    ]}
                  />
                </div>
                {selectedTemplate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearTemplate}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Hapus Template
                  </Button>
                )}
              </div>
              {selectedTemplate && (
                <p className="text-xs text-green-700 mt-2 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Template dipilih: Data akan mengisi form secara otomatis. Anda masih bisa mengubah data sebelum menyimpan.
                  {(() => {
                    const selectedOwner = availableOwners.find(owner => String(owner.id) === String(selectedTemplate));
                    return selectedOwner ? ` (Dari: ${selectedOwner.gemstone_name || 'Unknown Gemstone'})` : '';
                  })()}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Pemilik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pemilik *
              </label>
              <Input
                name="owner_name"
                value={formData.owner_name}
                onChange={handleInputChange}
                placeholder="Masukkan nama pemilik"
                className={`${errors.owner_name ? 'border-red-500' : ''} ${selectedTemplate && formData.owner_name ? 'border-green-300 bg-green-50' : ''}`}
              />
              {errors.owner_name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.owner_name}
                </p>
              )}
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon *
              </label>
              <Input
                name="owner_phone"
                value={formData.owner_phone}
                onChange={handleInputChange}
                placeholder="Masukkan nomor telepon"
                className={`${errors.owner_phone ? 'border-red-500' : ''} ${selectedTemplate && formData.owner_phone ? 'border-green-300 bg-green-50' : ''}`}
              />
              {errors.owner_phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.owner_phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                name="owner_email"
                type="email"
                value={formData.owner_email}
                onChange={handleInputChange}
                placeholder="Masukkan email (opsional)"
                className={`${errors.owner_email ? 'border-red-500' : ''} ${selectedTemplate && formData.owner_email ? 'border-green-300 bg-green-50' : ''}`}
              />
              {errors.owner_email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.owner_email}
                </p>
              )}
            </div>

            {/* Tanggal Mulai Kepemilikan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai Kepemilikan *
              </label>
              <Input
                name="ownership_start_date"
                type="date"
                value={formData.ownership_start_date}
                onChange={handleInputChange}
                min={dateConstraints.minStartDate ? formatDateForInput(dateConstraints.minStartDate) : undefined}
                max={dateConstraints.maxStartDate ? formatDateForInput(dateConstraints.maxStartDate) : undefined}
                className={errors.ownership_start_date ? 'border-red-500' : ''}
              />
              {errors.ownership_start_date && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.ownership_start_date}
                </p>
              )}
            </div>

            {/* Tanggal Berakhir Kepemilikan - Hidden for current owner, transfer mode, or first owner */}
            {!(editingOwner && editingOwner.is_current_owner) && !formData.is_transfer && hasCurrentOwner && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Berakhir Kepemilikan {(editingOwner && !editingOwner.is_current_owner) || (!editingOwner && !formData.is_transfer && hasCurrentOwner) ? '*' : ''}
                </label>
                <Input
                  name="ownership_end_date"
                  type="date"
                  value={formData.ownership_end_date || ''}
                  onChange={handleInputChange}
                  min={formData.ownership_start_date}
                  max={dateConstraints.maxEndDate ? formatDateForInput(dateConstraints.maxEndDate) : undefined}
                  disabled={!formData.ownership_start_date}
                  required={(editingOwner && !editingOwner.is_current_owner) || (!editingOwner && !formData.is_transfer && hasCurrentOwner)}
                  className={`${errors.ownership_end_date ? 'border-red-500' : ''} ${!formData.ownership_start_date ? 'bg-gray-100' : ''}`}
                />
                {!formData.ownership_start_date && (
                  <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Pilih tanggal mulai terlebih dahulu
                  </p>
                )}
                {errors.ownership_end_date && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.ownership_end_date}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Info box for current owner */}
          {Boolean(editingOwner && editingOwner.is_current_owner) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>
                  <strong>Pemilik Aktif:</strong> Tanggal berakhir kepemilikan tidak diperlukan karena ini adalah pemilik saat ini.
                </span>
              </p>
            </div>
          )}

          {/* Info box for transfer mode */}
          {!editingOwner && formData.is_transfer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>
                  <strong>Mode Transfer:</strong> Tanggal berakhir kepemilikan tidak diperlukan karena pemilik baru akan menjadi pemilik aktif.
                </span>
              </p>
            </div>
          )}

          {/* Info box for first owner */}
          {!editingOwner && !hasCurrentOwner && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>
                  <strong>Pemilik Pertama:</strong> Tanggal berakhir kepemilikan tidak diperlukan karena ini adalah pemilik pertama. {' '}
                  Pemilik akan otomatis menjadi pemilik aktif.
                </span>
              </p>
            </div>
          )}

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <Textarea
              name="owner_address"
              value={formData.owner_address}
              onChange={handleInputChange}
              placeholder="Masukkan alamat pemilik (opsional)"
              rows={3}
              className={`${selectedTemplate && formData.owner_address ? 'border-green-300 bg-green-50' : ''}`}
            />
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan
            </label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Masukkan catatan tambahan (opsional)"
              rows={3}
              className={`${selectedTemplate && formData.notes ? 'border-green-300 bg-green-50' : ''}`}
            />
          </div>

          {/* Transfer Ownership Checkbox - Only show when adding new owner and there's a current owner */}
          {!editingOwner && hasCurrentOwner && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="is_transfer"
                  name="is_transfer"
                  checked={formData.is_transfer}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="is_transfer" className="block text-sm font-medium text-blue-900 cursor-pointer">
                    Transfer Kepemilikan
                  </label>
                  <p className="text-xs text-blue-700 mt-1">
                    Centang jika pemilik baru ini akan menggantikan pemilik aktif saat ini.
                    Jika tidak dicentang, pemilik akan ditambahkan sebagai riwayat pemilik sebelumnya.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit">
              {editingOwner ? 'Perbarui' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEditOwnerModal;
