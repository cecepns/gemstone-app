// ANCHOR: ProtectedRoute Component - Wrapper for admin-only routes with authentication check
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/**
 * ProtectedRoute component to protect admin-only routes
 * Checks authentication status and redirects to login if not authenticated
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.redirectTo - Custom redirect path (default: '/login')
 * @returns {React.ReactElement} - Rendered children or redirect component
 */
const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading, token, isTokenExpired } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden flex items-center justify-center">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Memeriksa Autentikasi...
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Mohon tunggu sebentar
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Additional check: verify token is not expired
  if (token && isTokenExpired()) {
    console.warn('Token has expired, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  // If authenticated and token is valid, render the protected content
  return children;
};

export default ProtectedRoute;