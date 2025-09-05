// ANCHOR: DatabaseBackupSettings Component - Database backup functionality
import { Download } from 'lucide-react';
import React, { useState } from 'react';

import { useAuth } from '../context/useAuth';
import { downloadDatabaseBackup } from '../utils/api';
import { showError, showSuccess } from '../utils/toast';

/**
 * DatabaseBackupSettings component - Database backup functionality
 * Allows admin to download database backup in SQL format
 *
 * @returns {React.ReactElement} - Rendered database backup settings
 */
const DatabaseBackupSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAuthHeader } = useAuth();

  // Handle database backup
  const handleBackupDatabase = async() => {
    setIsLoading(true);

    try {
      const { blob, filename } = await downloadDatabaseBackup(getAuthHeader());
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccess('Backup database berhasil dibuat');
    } catch (error) {
      showError(error.message || 'Gagal membuat backup database');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <button
            onClick={handleBackupDatabase}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
  );
};

export default DatabaseBackupSettings;
