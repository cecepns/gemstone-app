// ANCHOR: GemstoneDetail Component - Display detailed gemstone information for admin
import {
  Gem,
  ArrowLeft,
  Printer,
  Edit,
  Trash2,
  Users,
  Plus,
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import GemstoneGallerySection from '../components/GemstoneGallerySection';
import PrintPreviewModal from '../components/PrintPreviewModal';
import GemstoneImageSection from '../components/shared/GemstoneImageSection';
import GemstoneLevelCard from '../components/shared/GemstoneLevelCard';
import GemstoneSpecifications from '../components/shared/GemstoneSpecifications';
import OwnerHistoryTable from '../components/shared/OwnerHistoryTable';
import { Button, Card, Alert, AddEditOwnerModal, DeleteOwnerModal, OwnerDetailModal } from '../components/ui';
import { useAuth } from '../context/useAuth';
import { getGemstoneDetail, deleteGemstone,
  getGemstoneOwners,
} from '../utils/api';

/**
 * GemstoneDetail component - Display detailed gemstone information
 * Shows all gemstone details, QR code, owner history, and admin action buttons
 *
 * @returns {React.ReactElement} - Rendered gemstone detail page
 */
const GemstoneDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();

  // Component state
  const [gemstone, setGemstone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false });

  // Owner history state
  const [owners, setOwners] = useState([]);
  const [isLoadingOwners, setIsLoadingOwners] = useState(false);
  const [ownersError, setOwnersError] = useState('');
  const [editingOwner, setEditingOwner] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);

  // Print card state
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Gallery state
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Copy state
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Copy gemstone ID to clipboard
   */
  const handleCopyId = async() => {
    try {
      await navigator.clipboard.writeText(gemstone.unique_id_number);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (_error) {
      // Failed to copy - silently ignore
    }
  };

  /**
   * Fetch gemstone details from API
   */
  const fetchGemstoneDetail = async() => {
    try {
      setIsLoading(true);
      setError('');

      const result = await getGemstoneDetail(id, getAuthHeader());

      setGemstone(result.data);
    } catch (error) {
      setError(error.message || 'Gagal memuat detail batu mulia');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch owners history from API
   */
  const fetchOwners = async() => {
    try {
      setIsLoadingOwners(true);
      setOwnersError('');

      const result = await getGemstoneOwners(id, getAuthHeader());
      setOwners(result.data);
    } catch (error) {
      setOwnersError(error.message || 'Gagal memuat riwayat pemilik');
    } finally {
      setIsLoadingOwners(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchGemstoneDetail();
      fetchOwners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Open add owner modal
   */
  const openAddModal = () => {
    setEditingOwner(null);
    setShowAddEditModal(true);
  };

  /**
   * Handle add owner success
   */
  const handleAddOwnerSuccess = () => {
    fetchOwners(); // Refresh data
  };

  /**
   * Open edit owner modal
   * @param {Object} owner - Owner data to edit
   */
  const openEditModal = (owner) => {
    setEditingOwner(owner);
    setShowAddEditModal(true);
  };

  /**
   * Open detail owner modal
   * @param {Object} owner - Owner data to show detail
   */
  const openDetailModal = (owner) => {
    setSelectedOwner(owner);
    setShowDetailModal(true);
  };

  /**
   * Open print preview modal
   */
  const openPrintPreview = () => {
    setShowPrintPreview(true);
  };

  /**
   * Handle edit action
   */
  const handleEdit = () => {
    navigate(`/admin/gemstones/${id}/edit`, { state: { from: 'detail' } });
  };

  /**
   * Open delete confirmation modal
   */
  const openDeleteModal = () => {
    setDeleteModal({ isOpen: true });
  };

  /**
   * Close delete confirmation modal
   */
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false });
  };

  /**
   * Handle delete action
   */
  const handleDelete = async() => {
    try {
      await deleteGemstone(id, getAuthHeader());
      navigate('/admin/gemstones');
    } catch (error) {
      setError(error.message || 'Terjadi kesalahan saat menghapus batu mulia');
    }
  };

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    navigate('/admin/gemstones');
  };

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 text-center w-full max-w-sm">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Memuat detail batu mulia...</p>
        </Card>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 w-full max-w-md">
          <Alert
            type="danger"
            title="Gagal Memuat Batu Mulia"
            className="mb-6"
          >
            {error}
          </Alert>
          <div className="text-center">
            <Button
              variant="primary"
              onClick={handleBack}
              fullWidth
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /**
   * No gemstone found
   */
  if (!gemstone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 w-full max-w-md text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gem className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Batu Mulia Tidak Ditemukan</h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">Batu mulia yang diminta tidak dapat ditemukan.</p>
          <Button
            variant="primary"
            onClick={handleBack}
            fullWidth
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and action buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button
          variant="secondary"
          onClick={handleBack}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar
        </Button>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={openPrintPreview}
            title="Cetak kartu batu mulia"
            className="w-full sm:w-auto"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak Kartu
          </Button>
          <Button
            variant="primary"
            onClick={handleEdit}
            title="Edit batu mulia"
            className="w-full sm:w-auto"
          >
            <Edit className="w-4 h-4 mr-2" />
            Ubah
          </Button>
          <Button
            variant="danger"
            onClick={openDeleteModal}
            title="Hapus batu mulia"
            className="w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Main content card */}
      <Card variant="elevated" padding="lg">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
          {/* Left column - Gemstone image and QR code */}
          <GemstoneImageSection gemstone={gemstone} />

          {/* Right column - Gemstone details */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              {gemstone.name || 'Batu Mulia Tanpa Nama'}
            </h3>

            <GemstoneSpecifications
              gemstone={gemstone}
              options={{
                onCopyId: handleCopyId,
                isCopied,
              }}
            />
          </div>
        </div>
      </Card>

      {/* Level Batu Mulia Section */}
      <GemstoneLevelCard gemstone={gemstone} />

      {/* Owner History Section */}
      <Card variant="elevated" padding="lg">
        <Card.Header>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Riwayat Pemilik Batu Mulia
                </h2>
                <p className="text-sm text-gray-600">{gemstone.name}</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={openAddModal}
              disabled={isLoadingOwners}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pemilik
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Owner History Content */}
          <div className="space-y-4">
            {isLoadingOwners ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Memuat riwayat pemilik...</span>
              </div>
            ) : ownersError ? (
              <Alert
                type="danger"
                title="Gagal Memuat Riwayat Pemilik"
              >
                {ownersError}
              </Alert>
            ) : owners.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Belum ada data pemilik</p>
                <Button variant="primary" onClick={openAddModal} className="mt-3 w-full sm:w-auto">
                  Tambah Pemilik Pertama
                </Button>
              </div>
            ) : (
              /* Owners Table using shared component */
              <OwnerHistoryTable
                owners={owners}
                loading={isLoadingOwners}
                error={ownersError}
                options={{
                  showActions: true,
                  onViewDetail: openDetailModal,
                  onEdit: openEditModal,
                  onDelete: setShowDeleteConfirm,
                }}
              />
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Gallery Section */}
      <Card variant="elevated" padding="lg">
        <Card.Header>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Galeri Foto Batu Mulia
                </h2>
                <p className="text-sm text-gray-600">{gemstone.name}</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
              className="w-full sm:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Gambar
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Gallery Content */}
          <GemstoneGallerySection
            gemstoneId={id}
            showUploadModal={showUploadModal}
            onCloseUploadModal={() => setShowUploadModal(false)}
            onOpenUploadModal={() => setShowUploadModal(true)}
            onRefresh={() => {
              // Force re-render of gallery section
              setShowUploadModal(false);
            }}
          />
        </Card.Body>
      </Card>

      {/* Add/Edit Owner Modal */}
      <AddEditOwnerModal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        onSuccess={handleAddOwnerSuccess}
        gemstoneId={id}
        gemstoneName={gemstone?.name}
        editingOwner={editingOwner}
      />

      {/* Delete Owner Modal */}
      <DeleteOwnerModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onSuccess={fetchOwners}
        gemstoneId={id}
        owner={showDeleteConfirm}
      />

      {/* Owner Detail Modal */}
      <OwnerDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        owner={selectedOwner}
        gemstoneName={gemstone?.name}
      />

      {/* Print Preview Modal */}
      <PrintPreviewModal
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        gemstone={gemstone}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        itemName={gemstone?.name}
        itemType="gemstone"
        title="Hapus Batu Mulia"
        description="Tindakan ini tidak dapat dibatalkan"
        warningMessage="Ini akan menghapus batu mulia secara permanen beserta semua data terkait termasuk gambar dan kode QR."
      />
    </div>
  );
};

export default GemstoneDetail;
