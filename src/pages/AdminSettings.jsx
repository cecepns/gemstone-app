import ContactSettings from '../components/ContactSettings';
import DatabaseBackupSettings from '../components/DatabaseBackupSettings';
import LevelColorSettings from '../components/LevelColorSettings';
import PasswordChangeSettings from '../components/PasswordChangeSettings';

const AdminSettings = () => {

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Admin</h1>
            <p className="text-gray-600 mt-1">Kelola informasi kontak, kata sandi dan backup sistem</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Change */}
        <PasswordChangeSettings />

        {/* Contact Settings */}
        <ContactSettings />

        {/* Level Color Settings */}
        <LevelColorSettings />

        {/* Database Backup */}
        <DatabaseBackupSettings />
      </div>
    </div>
  );
};

export default AdminSettings;
