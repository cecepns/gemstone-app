import classNames from 'classnames';
import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

/**
 * ANCHOR: Table Component
 * A responsive table component with sorting, pagination, and mobile-friendly design
 */
const Table = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  emptyMessage = 'Tidak ada data tersedia',
  variant = 'default',
  size = 'md',
  striped = false,
  hoverable = true,
  sortable = false,
  onSort = null,
  sortColumn = null,
  sortDirection = 'asc',
  className = '',
  ...props
}) => {
  // Responsive table wrapper classes
  const wrapperClasses = classNames(
    'overflow-x-auto -mx-4 sm:mx-0',
    className,
  );

  // Table container classes
  const containerClasses = classNames(
    'min-w-full inline-block align-middle',
  );

  // Table classes
  const tableClasses = classNames(
    'min-w-full divide-y divide-gray-200',
    {
      'bg-white': variant === 'default',
      'bg-gray-50': variant === 'striped',
    },
  );

  // Responsive size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
  };

  // Handle sort click
  const handleSort = (columnKey) => {
    if (!sortable || !onSort) return;
    onSort(columnKey);
  };

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (!sortable) return null;
    
    if (sortColumn === columnKey) {
      return sortDirection === 'asc' ? (
        <ChevronUp className="w-4 h-4 ml-1" />
      ) : (
        <ChevronDown className="w-4 h-4 ml-1" />
      );
    }
    
    return <ChevronUp className="w-4 h-4 ml-1 text-gray-300" />;
  };

  // Loading state
  if (loading) {
    return (
      <div className={wrapperClasses}>
        <div className={containerClasses}>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Memuat data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={wrapperClasses}>
        <div className={containerClasses}>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <span className="text-gray-600">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={wrapperClasses}>
        <div className={containerClasses}>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center py-12">
              <span className="text-gray-500">{emptyMessage}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <div className={containerClasses}>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className={tableClasses} {...props}>
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key || index}
                    className={classNames(
                      'px-3 sm:px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider',
                      sizeClasses[size],
                      {
                        'cursor-pointer hover:bg-gray-100 transition-colors': sortable && column.sortable !== false,
                        'select-none': sortable,
                      },
                      column.headerClassName,
                    )}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {renderSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={classNames(
                    {
                      'hover:bg-gray-50 transition-colors': hoverable,
                      'bg-gray-50': striped && rowIndex % 2 === 1,
                    },
                    row.className,
                  )}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={column.key || colIndex}
                      className={classNames(
                        'px-3 sm:px-4 py-3',
                        sizeClasses[size],
                        {
                          'whitespace-nowrap': column.nowrap !== false,
                          'text-right': column.align === 'right',
                          'text-center': column.align === 'center',
                        },
                        column.cellClassName,
                      )}
                    >
                      {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * ANCHOR: Table Header Component
 * Header section for table with title and actions
 */
const TableHeader = ({
  title,
  subtitle,
  children,
  className = '',
  ...props
}) => {
  const headerClasses = classNames(
    'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4',
    className,
  );

  return (
    <div className={headerClasses} {...props}>
      <div>
        {title && (
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap gap-2">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * ANCHOR: Table Footer Component
 * Footer section for table with pagination and summary
 */
const TableFooter = ({
  children,
  className = '',
  ...props
}) => {
  const footerClasses = classNames(
    'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4',
    className,
  );

  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * ANCHOR: Pagination Component
 * Pagination controls for table
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 25, 50, 100],
  onItemsPerPageChange,
  className = '',
  ...props
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={classNames('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', className)} {...props}>
      {/* Items per page selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Tampilkan:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">item</span>
        </div>
      )}

      {/* Page info */}
      <div className="text-sm text-gray-700">
        Menampilkan {startItem} - {endItem} dari {totalItems} item
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Sebelumnya
        </button>
        
        {renderPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
            className={classNames(
              'px-3 py-1 text-sm border border-gray-300 rounded-md',
              {
                'bg-blue-600 text-white border-blue-600': page === currentPage,
                'hover:bg-gray-50': page !== currentPage && page !== '...',
                'cursor-default': page === '...',
              },
            )}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

// Attach sub-components to Table
Table.Header = TableHeader;
Table.Footer = TableFooter;
Table.Pagination = Pagination;

export default Table;
