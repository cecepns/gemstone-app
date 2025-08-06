// ANCHOR: AdminDashboard Component - Main admin control center
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
        
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            
            {/* Title and Welcome */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3 font-display">
                📊 Admin Dashboard
              </h1>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed">
                  Welcome back, <span className="font-semibold text-purple-600">{admin?.username}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {formatTime()}
                </p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              {/* Admin Info Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">👤</div>
                <p className="text-sm font-medium text-purple-800">{admin?.username}</p>
                <p className="text-xs text-purple-600">Administrator</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 active:from-red-800 active:to-red-900 transition duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg">🚪</span>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Add Gemstone Form */}
          <div className="space-y-8">
            <AddGemstoneForm />
            
            {/* Quick Stats Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">📈</span>
                </div>
                Quick Statistics
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-xl p-6 text-center group hover:bg-purple-100 transition duration-200">
                  <div className="text-3xl text-purple-600 font-bold mb-2">0</div>
                  <div className="text-sm text-purple-800 font-medium">Total Gemstones</div>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center group hover:bg-green-100 transition duration-200">
                  <div className="text-3xl text-green-600 font-bold mb-2">0</div>
                  <div className="text-sm text-green-800 font-medium">Today's Verifications</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Gemstone List */}
          <div className="space-y-8">
            <GemstoneList />
            
            {/* Recent Activity Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">📝</span>
                </div>
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition duration-200">
                  <div className="text-xl mr-4">✅</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Dashboard loaded</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition duration-200">
                  <div className="text-xl mr-4">🔐</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Admin login successful</p>
                    <p className="text-xs text-gray-500">A few seconds ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-lg">⚡</span>
            </div>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition duration-200 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
              <p className="font-medium text-sm">View Reports</p>
            </button>
            
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-xl hover:from-green-700 hover:to-green-800 transition duration-200 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔍</div>
              <p className="font-medium text-sm">Search Gemstone</p>
            </button>
            
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-200 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📱</div>
              <p className="font-medium text-sm">QR Generator</p>
            </button>
            
            <button className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-6 rounded-xl hover:from-gray-700 hover:to-gray-800 transition duration-200 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
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