// ANCHOR: PublicLayout Component - Base layout for public pages (home, login, verification)
import { Outlet } from 'react-router-dom';

/**
 * PublicLayout component - Base layout wrapper for public pages
 * Provides consistent layout structure for home, login, and verification pages
 * Uses React Router's Outlet for nested routing
 * 
 * @returns {React.ReactElement} - Rendered layout with outlet
 */
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 flex flex-col">
        <main style={{ minHeight: 'calc(100vh - 89px)' }}>
          {/* Outlet for nested routes */}
          <Outlet />
        </main>
      </div>

      <footer className="text-center py-8 border-t border-gray-200/50">
        <p className="text-gray-500">
          © 2024 Sistem Verifikasi Batu Mulia. Semua hak dilindungi.
        </p>
      </footer>
    </div>
  );
};

export default PublicLayout; 