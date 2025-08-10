import { Download, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const AdminSettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ANCHOR: Handle password change form submission
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement password change logic
    setTimeout(() => {
      setIsLoading(false);
      // Reset form
      e.target.reset();
    }, 2000);
  };

  // ANCHOR: Handle database backup
  const handleBackupDatabase = async () => {
    setIsLoading(true);
    
    // TODO: Implement database backup logic
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Admin</h1>
            <p className="text-gray-600 mt-1">Kelola pengaturan keamanan dan backup sistem</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Change */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-purple-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Ganti Sandi</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">Ubah kata sandi akun admin</p>
          </div>
          <div className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sandi Saat Ini
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Masukkan sandi saat ini"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Masukkan sandi baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Konfirmasi sandi baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengubah Sandi...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Ubah Sandi
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Database Backup */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Download className="w-5 h-5 text-purple-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Backup Database</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">Cadangkan data database dalam format SQL</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Informasi Backup</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Cadangan Terakhir:</span>
                    <span className="font-medium">2 jam yang lalu</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ukuran Database:</span>
                    <span className="font-medium">~15.2 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-600">Siap</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleBackupDatabase}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Membuat Backup...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Backup Database SQL
                  </>
                )}
              </button>
              
              <div className="text-xs text-gray-500 text-center">
                File backup akan otomatis diunduh dalam format .sql
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 