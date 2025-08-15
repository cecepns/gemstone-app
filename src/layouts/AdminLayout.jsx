/* eslint-disable jsx-a11y/click-events-have-key-events */
// ANCHOR: AdminLayout Component - Layout for admin dashboard and gemstone management
import { LayoutDashboard, Package, Settings, LogOut, Shield, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';

import { useAuth } from '../context/useAuth';

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

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Navigation items for admin
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Kelola Batu Mulia',
      href: '/admin/gemstones',
      icon: <Package className="w-5 h-5" />,
    },
    {
      name: 'Pengaturan',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          <div className="text-center border-b border-gray-200 py-6">
            <h3 className="font-bold text-2xl text-gray-900">Panel Admin</h3>
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

      {/* Mobile sidebar overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="fixed inset-0 flex">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-gray-900 transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-40' : 'opacity-0'}`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Tutup sidebar</span>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 h-0 pt-16 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-semibold text-gray-900">Panel Admin</h1>
                    <p className="text-sm text-gray-500">Manajemen Batu Mulia</p>
                  </div>
                </div>
              </div>
              <nav className="px-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-purple-100 text-purple-900 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className={`mr-4 ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User section */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
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
                  className="ml-3 flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Buka sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {admin?.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h3 className="font-bold text-xl sm:text-2xl text-gray-900">
              {navigationItems.find(item => item.href === location.pathname)?.name || 'Dashboard Admin'}
            </h3>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="py-4 sm:py-6">
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
