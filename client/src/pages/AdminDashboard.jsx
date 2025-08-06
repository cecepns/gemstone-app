// ANCHOR: AdminDashboard Component - Main admin control center
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, LogOut, CheckCircle, Search, Settings, Smartphone, RefreshCw, Gem, FileText, Activity, Zap } from 'lucide-react';

// Import actual components
import AddGemstoneForm from '../components/AddGemstoneForm';
import GemstoneList from '../components/GemstoneList';

const AdminDashboard = () => {
  // Get auth context
  const { admin, logout, getAuthHeader } = useAuth();
  
  // Dashboard state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Handle logout function
   */
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  /**
   * Format current time
   * @returns {string} - Formatted time string
   */
  const formatTime = () => {
    return currentTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <Gem className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Gemstones</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalGemstones}</p>
                <p className="text-sm text-gray-500">Gemstone terdaftar</p>
              </div>
            </div>
          </div>

          {/* Recent Verifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Recent Verifications</h3>
                <p className="text-3xl font-bold text-green-600">{stats.recentVerifications}</p>
                <p className="text-sm text-gray-500">Verifikasi hari ini</p>
              </div>
            </div>
          </div>

          {/* Total Verifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Verifications</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalVerifications}</p>
                <p className="text-sm text-gray-500">Total verifikasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition duration-200 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 mx-auto" />
              </div>
              <p className="font-medium text-sm">View Reports</p>
            </button>
            
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-xl hover:from-green-700 hover:to-green-800 transition duration-200 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 mx-auto" />
              </div>
              <p className="font-medium text-sm">Search Gemstone</p>
            </button>
            
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-200 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                <Smartphone className="w-8 h-8 mx-auto" />
              </div>
              <p className="font-medium text-sm">QR Generator</p>
            </button>
            
            <button className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-6 rounded-xl hover:from-gray-700 hover:to-gray-800 transition duration-200 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8 mx-auto" />
              </div>
              <p className="font-medium text-sm">Settings</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Gemstone Verification System - Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;