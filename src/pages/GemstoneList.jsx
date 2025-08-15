// ANCHOR: GemstoneList Component - Display and manage gemstone data
import { Gem, Search, Smartphone, Edit, CheckCircle, AlertCircle, FileText, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { Button, Input, Card, Table } from '../components/ui';
import { useAuth } from '../context/useAuth';
import { getGemstones, deleteGemstone } from '../utils/api';
import { showSuccess } from '../utils/toast';

const GemstoneList = () => {
  // Get auth context for token
  const { getAuthHeader } = useAuth();
  const navigate = useNavigate();

  // Component state
  const [gemstones, setGemstones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, gemstone: null });

  /**
   * Fetch gemstones from API
   */
  const fetchGemstones = async() => {
    try {
      setIsLoading(true);
      setError('');

      // Use API utility to fetch gemstones
      const result = await getGemstones({
        authHeader: getAuthHeader(),
      });

      setGemstones(result.data || []);
    } catch (error) {
      console.error('Error fetching gemstones:', error);
      setError(error.message || 'Failed to load gemstone data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchGemstones();
  }, []);

  /**
   * Filter and sort gemstones
   */
  const filteredAndSortedGemstones = gemstones
    .filter(gemstone =>
      gemstone.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gemstone.unique_id_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gemstone.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gemstone.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gemstone.current_owner_name?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
      if (sortBy === 'weight_carat') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handle sort change
   */
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  /**
   * Copy ID to clipboard
   */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess('Berhasil disalin ke clipboard!');
    });
  };

  /**
   * Handle add gemstone navigation
   */
  const handleAddGemstone = () => {
    navigate('/admin/gemstones/add');
  };

  /**
   * Open delete confirmation modal
   * @param {Object} gemstone - Gemstone object to delete
   */
  const openDeleteModal = (gemstone) => {
    setDeleteModal({ isOpen: true, gemstone });
  };

  /**
   * Close delete confirmation modal
   */
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, gemstone: null });
  };

  /**
   * Handle delete gemstone confirmation
   */
  const handleDeleteConfirm = async() => {
    const { gemstone } = deleteModal;

    if (!gemstone) {
      return;
    }

    try {
      await deleteGemstone(gemstone.id, getAuthHeader());

      // Refresh the gemstone list after successful deletion
      await fetchGemstones();

      console.log('Gemstone deleted successfully');
    } catch (error) {
      console.error('Error deleting gemstone:', error);
      setError(error.message || 'Failed to delete gemstone');
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'image',
      header: 'Gambar',
      align: 'center',
      render: (value, row) => (
        <div className="flex justify-center">
          {row.photo_url ? (
            <img
              src={row.photo_url}
              alt={row.name}
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <Gem className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'unique_id_number',
      header: 'Nomor ID',
      render: (value, row) => (
        <span
          className="text-xs sm:text-sm text-purple-600 font-mono cursor-pointer hover:bg-purple-50 px-2 py-1 rounded transition duration-200 break-all"
          onClick={() => copyToClipboard(row.unique_id_number)}
          title="Klik untuk menyalin"
        >
          {row.unique_id_number}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Nama',
      render: (value, row) => (
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
            {row.name || 'Batu Mulia Tanpa Nama'}
          </div>
        </div>
      ),
    },
    {
      key: 'current_owner_name',
      header: 'Pemilik Aktif',
      render: (value, row) => (
        <div className="min-w-0">
          {row.current_owner_name ? (
            <span className="text-xs sm:text-sm text-gray-900 truncate">
              {row.current_owner_name}
            </span>
          ) : (
            <div className="text-xs sm:text-sm text-gray-400 italic">
              Belum ada pemilik
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Tanggal Ditambahkan',
      render: (value, row) => (
        <div className="text-xs sm:text-sm text-gray-900">
          {formatDate(row.created_at)}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      align: 'center',
      render: (value, row) => (
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="text-xs px-2 py-1 w-full sm:w-auto"
            title="Edit batu mulia"
            onClick={() => navigate(`/admin/gemstones/${row.id}/edit`, { state: { from: 'list' } })}
          >
            <Edit className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Ubah</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/admin/gemstones/${row.id}`)}
            className="text-xs px-2 py-1 w-full sm:w-auto"
            title="Lihat detail batu mulia"
          >
            <Search className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Detail</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => openDeleteModal(row)}
            className="text-xs px-2 py-1 w-full sm:w-auto"
            title="Hapus batu mulia"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100">
        {/* Header */}
        <Table.Header
          title={
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Gem className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xl sm:text-2xl font-semibold text-gray-800">Daftar Batu Mulia</span>
            </div>
          }
        >
          <div className="flex flex-col sm:flex-row w-full sm:w-auto">
            <Button
              variant="success"
              size="md"
              onClick={handleAddGemstone}
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
              title="Tambah batu mulia baru"
            >
              <Plus className="w-5 h-5" />
              Tambah
            </Button>
          </div>
        </Table.Header>

        {/* Search and Sort Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="w-full">
            <Input
              type="text"
              placeholder="Cari berdasarkan nama, ID, warna, atau asal..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="md"
              className="rounded-xl bg-white/50 backdrop-blur-sm"
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>

          {/* Sort Options */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-sm text-gray-600 whitespace-nowrap">Urutkan berdasarkan:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { field: 'created_at', label: 'Tanggal' },
                { field: 'name', label: 'Nama' },
                { field: 'weight_carat', label: 'Berat' },
                { field: 'color', label: 'Warna' },
              ].map(({ field, label }) => (
                <Button
                  key={field}
                  variant={sortBy === field ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleSortChange(field)}
                  className="rounded-xl text-xs sm:text-sm"
                >
                  {label}
                  {sortBy === field && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Gemstone Table */}
        <Table
          data={filteredAndSortedGemstones}
          columns={columns}
          loading={isLoading}
          error={error}
          emptyMessage={
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gem className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak Ada Batu Mulia Ditemukan</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Tidak ada batu mulia yang sesuai dengan kriteria pencarian Anda.' : 'Belum ada batu mulia yang ditambahkan.'}
              </p>
              {searchTerm && (
                <Button
                  variant="primary"
                  onClick={() => setSearchTerm('')}
                  className="rounded-xl"
                >
                  Bersihkan Pencarian
                </Button>
              )}
            </div>
          }
          variant="default"
          size="md"
          striped={false}
          hoverable
          sortable={false}
        />
      </Card>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.gemstone?.name}
        itemType="gemstone"
        title="Hapus Batu Mulia"
        description="Tindakan ini tidak dapat dibatalkan"
        warningMessage="Ini akan menghapus batu mulia secara permanen dan semua data terkait termasuk gambar dan kode QR."
      />
    </>
  );
};

export default GemstoneList;
