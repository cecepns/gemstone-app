import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, Eye } from 'lucide-react';
import { Table, Button, Badge, Input } from './index';

/**
 * ANCHOR: Table Demo Component
 * Demonstrates the usage of the Table component with various features
 */
const TableDemo = () => {
  // Sample data
  const sampleData = [
    {
      id: 1,
      name: 'Batu Ruby Merah',
      category: 'Ruby',
      weight: '2.5 carat',
      price: 'Rp 15.000.000',
      status: 'active',
      owner: 'John Doe',
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'Sapphire Biru',
      category: 'Sapphire',
      weight: '1.8 carat',
      price: 'Rp 12.500.000',
      status: 'inactive',
      owner: 'Jane Smith',
      date: '2024-01-10',
    },
    {
      id: 3,
      name: 'Emerald Hijau',
      category: 'Emerald',
      weight: '3.2 carat',
      price: 'Rp 25.000.000',
      status: 'active',
      owner: 'Bob Johnson',
      date: '2024-01-20',
    },
    {
      id: 4,
      name: 'Diamond Putih',
      category: 'Diamond',
      weight: '1.5 carat',
      price: 'Rp 30.000.000',
      status: 'active',
      owner: 'Alice Brown',
      date: '2024-01-25',
    },
    {
      id: 5,
      name: 'Opal Pelangi',
      category: 'Opal',
      weight: '4.0 carat',
      price: 'Rp 8.500.000',
      status: 'inactive',
      owner: 'Charlie Wilson',
      date: '2024-01-05',
    },
  ];

  // State for table features
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = sampleData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [sampleData, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handle sort
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Column definitions
  const columns = [
    {
      key: 'name',
      header: 'Nama Batu Mulia',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">ID: {row.id}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      sortable: true,
      render: (value) => (
        <Badge variant="secondary" className="text-xs">
          {value}
        </Badge>
      ),
    },
    {
      key: 'weight',
      header: 'Berat',
      sortable: true,
      align: 'center',
    },
    {
      key: 'price',
      header: 'Harga',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-semibold text-green-600">{value}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      align: 'center',
      render: (value) => (
        <Badge 
          variant={value === 'active' ? 'success' : 'secondary'}
          className="text-xs"
        >
          {value === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      ),
    },
    {
      key: 'owner',
      header: 'Pemilik',
      sortable: true,
    },
    {
      key: 'date',
      header: 'Tanggal',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('id-ID'),
    },
    {
      key: 'actions',
      header: 'Aksi',
      align: 'center',
      nowrap: true,
      render: (value, row) => (
        <div className="flex items-center justify-center gap-1">
          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:bg-green-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Basic Table Example */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Table</h2>
        <Table
          data={sampleData.slice(0, 3)}
          columns={columns.slice(0, 4)} // Show only first 4 columns
          size="md"
          hoverable
          striped
        />
      </div>

      {/* Advanced Table with Features */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Advanced Table with Features</h2>
        
        {/* Table Header */}
        <Table.Header
          title="Daftar Batu Mulia"
          subtitle={`Total ${filteredData.length} batu mulia ditemukan`}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari batu mulia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Baru
            </Button>
          </div>
        </Table.Header>

        {/* Table */}
        <Table
          data={paginatedData}
          columns={columns}
          loading={loading}
          sortable
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          size="md"
          hoverable
          striped
          className="mb-4"
        />

        {/* Table Footer with Pagination */}
        <Table.Footer>
          <Table.Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / itemsPerPage)}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            showItemsPerPage
            itemsPerPageOptions={[5, 10, 25, 50]}
          />
        </Table.Footer>
      </div>

      {/* Loading State Example */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Loading State</h2>
        <Table
          data={[]}
          columns={columns.slice(0, 4)}
          loading={true}
        />
      </div>

      {/* Empty State Example */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Empty State</h2>
        <Table
          data={[]}
          columns={columns.slice(0, 4)}
          emptyMessage="Belum ada data batu mulia yang tersedia"
        />
      </div>

      {/* Error State Example */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Error State</h2>
        <Table
          data={[]}
          columns={columns.slice(0, 4)}
          error="Gagal memuat data. Silakan coba lagi."
        />
      </div>

      {/* Small Size Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Small Size Table</h2>
        <Table
          data={sampleData.slice(0, 3)}
          columns={columns.slice(0, 4)}
          size="sm"
          hoverable
        />
      </div>

      {/* Large Size Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Large Size Table</h2>
        <Table
          data={sampleData.slice(0, 3)}
          columns={columns.slice(0, 4)}
          size="lg"
          hoverable
        />
      </div>
    </div>
  );
};

export default TableDemo;
