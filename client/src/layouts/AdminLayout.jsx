// ANCHOR: AdminLayout Component - Layout for admin dashboard and gemstone management
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { LayoutDashboard, Package, Settings, LogOut, Shield, Menu } from 'lucide-react';

/**
 * AdminLayout component - Layout wrapper for admin pages
 * Provides admin-specific navigation, sidebar, and user management
 * Uses React Router's Outlet for nested routing
 * 
 * @returns {React.ReactElement} - Rendered admin layout with outlet
 */
const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items for admin
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Kelola Gemstone',
      href: '/admin/gemstones',
      icon: <Package className="w-5 h-5" />
    },
    {
      name: 'Pengaturan',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          <div className="text-center border-b border-gray-200 py-6">
            <h3 className="font-bold text-2xl text-gray-900">Admin Panel</h3>
          </div>

          <div className="mt-4 flex-grow">
            <nav className="px-2 space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-purple-100 text-purple-900 border-r-2 border-purple-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`mr-3 ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {admin?.name?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {admin?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                      <p className="text-sm text-gray-500">Gemstone Management</p>
                    </div>
                  </div>
                </div>
                <nav className="mt-8 px-2 space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                          isActive
                            ? 'bg-purple-100 text-purple-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className={`mr-4 ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                          {item.icon}
                        </span>
                        {item.name}
                      </a>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {admin?.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {admin?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-3 flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h3 className="font-bold text-2xl text-gray-900">
              {navigationItems.find(item => item.href === location.pathname)?.name || 'Admin Dashboard'}
            </h3>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Outlet for nested routes */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 