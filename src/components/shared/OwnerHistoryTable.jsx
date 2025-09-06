// ANCHOR: OwnerHistoryTable Component - Shared component for displaying owner history
import {
  Calendar,
  UserCheck,
  UserX,
  FileText,
  Edit,
  Trash2,
} from 'lucide-react';

import { formatDate, formatDateEnglish } from '../../utils/dateUtils';
import { Table, Badge, Button } from '../ui';

/**
 * OwnerHistoryTable component - Display owner history in a consistent format
 * Used in both admin detail view and public verification view
 *
 * @param {Array} owners - Array of owner data
 * @param {boolean} loading - Loading state
 * @param {string} error - Error message
 * @param {Object} options - Display options
 * @param {boolean} options.showActions - Whether to show action buttons (admin only)
 * @param {Function} options.onViewDetail - Callback for view detail action
 * @param {Function} options.onEdit - Callback for edit action
 * @param {Function} options.onDelete - Callback for delete action
 * @param {boolean} options.useEnglishDate - Whether to use English date format (for public verification)
 * @param {string} options.className - Additional CSS classes
 * @returns {React.ReactElement} - Rendered owner history table
 */
const OwnerHistoryTable = ({
  owners = [],
  loading = false,
  error = '',
  options = {},
  className = '',
}) => {
  const {
    showActions = false,
    onViewDetail,
    onEdit,
    onDelete,
    useEnglishDate = false,
  } = options;

  // Choose date formatter based on options
  const dateFormatter = useEnglishDate ? formatDateEnglish : formatDate;

  // Column definitions for owners table
  const ownerColumns = [
    {
      key: 'owner_name',
      header: 'Nama Pemilik',
      render: (value, row) => (
        <div>
          <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{value}</div>
          {row.owner_phone && (
            <div className="text-xs text-gray-600">{row.owner_phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'is_current_owner',
      header: 'Status',
      align: 'center',
      render: (value) => (
        value ? (
          <Badge variant="success" className="flex items-center gap-1 w-fit text-xs">
            <UserCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Pemilik Aktif</span>
            <span className="sm:hidden">Aktif</span>
          </Badge>
        ) : (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit text-xs">
            <UserX className="w-3 h-3" />
            <span className="hidden sm:inline">Mantan Pemilik</span>
            <span className="sm:hidden">Mantan</span>
          </Badge>
        )
      ),
    },
    {
      key: 'ownership_period',
      header: 'Periode Kepemilikan',
      render: (value, row) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            {dateFormatter(row.ownership_start_date)}
            {row.ownership_end_date ? (
              <span> - {dateFormatter(row.ownership_end_date)}</span>
            ) : (
              <span> - Sekarang</span>
            )}
          </span>
        </div>
      ),
    },
    // Add actions column only for admin view
    ...(showActions ? [{
      key: 'actions',
      header: 'Aksi',
      align: 'center',
      nowrap: true,
      render: (value, row) => (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          {onViewDetail && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onViewDetail(row)}
              disabled={loading}
              title="Detail pemilik"
              className="text-xs px-2 py-1 w-full sm:w-auto"
            >
              <FileText className="w-3 h-3" />
              <span className="hidden sm:inline ml-1">Detail</span>
            </Button>
          )}
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(row)}
              disabled={loading}
              title="Edit pemilik"
              className="text-xs px-2 py-1 w-full sm:w-auto"
            >
              <Edit className="w-3 h-3" />
              <span className="hidden sm:inline ml-1">Ubah</span>
            </Button>
          )}
          {onDelete && !row.is_current_owner && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(row)}
              disabled={loading}
              title="Hapus pemilik"
              className="text-xs px-2 py-1 w-full sm:w-auto"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline ml-1">Hapus</span>
            </Button>
          )}
        </div>
      ),
    }] : []),
  ];

  return (
    <div className={className}>
      <Table
        data={owners}
        columns={ownerColumns}
        loading={loading}
        error={error}
        emptyMessage="Belum ada data pemilik"
        size="md"
        hoverable
        striped
      />
    </div>
  );
};

export default OwnerHistoryTable;
