// ANCHOR: AdminDashboard Component - Main admin interface
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, LogOut, CheckCircle, Search, Settings, Smartphone, RefreshCw, Gem, FileText, Activity, Zap, Plus, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { admin, logout, getAuthHeader } = useAuth();
  const [stats, setStats] = useState({
    totalGemstones: 0,
    recentVerifications: 0,
    totalVerifications: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch dashboard statistics
   */
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // This is a placeholder - you can implement actual API calls later
      // const response = await fetch('http://localhost:5000/api/admin/stats', {
      //   headers: getAuthHeader()
      // });
      
      // Simulate API call with timeout
      setTimeout(() => {
        setStats({
          totalGemstones: 156,
          recentVerifications: 23,
          totalVerifications: 1247
        });
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Selamat datang, <strong>{admin?.username}</strong>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Login sebagai</p>
                <p className="font-medium text-gray-800">{admin?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Gemstones */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <Gem className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Gemstones</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalGemstones}</p>
                <p className="text-sm text-gray-500">Gemstone terdaftar</p>
              </div>
            </div>
          </div>

          {/* Recent Verifications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Verifikasi Hari Ini</h3>
                <p className="text-3xl font-bold text-green-600">{stats.recentVerifications}</p>
                <p className="text-sm text-gray-500">Verifikasi berhasil</p>
              </div>
            </div>
          </div>

          {/* Total Verifications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Verifikasi</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalVerifications}</p>
                <p className="text-sm text-gray-500">Sejak sistem berjalan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6 text-purple-600" />
            Aksi Cepat
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Add Gemstone */}
            <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-200 text-center">
              <div className="text-2xl mb-2">
                <Plus className="w-8 h-8 mx-auto" />
              </div>
              <p className="font-medium">Tambah Gemstone</p>
            </button>

            {/* View All Gemstones */}
            <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition duration-200 text-center">
              <div className="text-2xl mb-2">
                <FileText className="w-8 h-8 mx-auto" />
              </div>
              <p className="font-medium">Kelola Gemstones</p>
            </button>

            {/* Verification Reports */}
            <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition duration-200 text-center">
              <div className="text-2xl mb-2">
                <BarChart3 className="w-8 h-8 mx-auto" />
              </div>
              <p className="font-medium">Laporan Verifikasi</p>
            </button>

            {/* System Settings */}
            <button className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200 text-center">
              <div className="text-2xl mb-2">
                <Settings className="w-8 h-8 mx-auto" />
              </div>
              <p className="font-medium">Pengaturan</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-600" />
            Aktivitas Terbaru
          </h2>
          
          <div className="space-y-4">
            {/* Sample activity items */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Gemstone baru ditambahkan</p>
                <p className="text-sm text-gray-500">Blue Sapphire - GEM-1704067200000-A1B2C3</p>
              </div>
              <div className="text-sm text-gray-500">2 jam lalu</div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Verifikasi berhasil</p>
                <p className="text-sm text-gray-500">Ruby - GEM-1704067200001-B2C3D4</p>
              </div>
              <div className="text-sm text-gray-500">5 jam lalu</div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Laporan bulanan dibuat</p>
                <p className="text-sm text-gray-500">Laporan verifikasi Januari 2024</p>
              </div>
              <div className="text-sm text-gray-500">1 hari lalu</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © 2024 Gemstone Verification System - Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;