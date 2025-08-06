// ANCHOR: LoginPage Component - Admin authentication interface with complete form handling
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  // Form state management
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Hooks
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * Validate form data
   * @returns {boolean} - True if form is valid
   */
  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username harus diisi');
      return false;
    }
    
    if (!formData.password.trim()) {
      setError('Password harus diisi');
      return false;
    }
    
    if (formData.username.length < 3) {
      setError('Username minimal 3 karakter');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }
    
    return true;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Make POST request to login API
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Login successful - use AuthContext login function
        login(result.data.token, result.data.admin);
        
        console.log('Login successful:', result.data.admin);
        
        // Navigate to admin dashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Login failed - show error message
        setError(result.message || 'Login gagal. Silakan periksa username dan password Anda.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.');
      } else {
        setError('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle demo login (quick login with demo credentials)
   */
  const handleDemoLogin = () => {
    setFormData({
      username: 'admin',
      password: 'admin123'
    });
    setError('');
  };

  /**
   * Handle Enter key press in form
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl mb-6 shadow-lg">
            <span className="text-3xl text-white">🔐</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3 font-display">
            Admin Login
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Access the gemstone verification system management dashboard
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <div className="text-red-500 text-xl">⚠️</div>
                <div>
                  <h4 className="text-red-800 font-medium">Login Failed</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter admin username"
                  className={`w-full px-4 py-3 pl-11 border rounded-xl focus:ring-2 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm ${
                    error && !formData.username.trim()
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-purple-500'
                  }`}
                  disabled={isLoading}
                  required
                  autoComplete="username"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">👤</span>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 pl-11 pr-11 border rounded-xl focus:ring-2 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm ${
                    error && !formData.password.trim()
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-purple-500'
                  }`}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔑</span>
                </div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  disabled={isLoading}
                >
                  <span className="text-lg">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.username.trim() || !formData.password.trim()}
              className={`w-full py-4 px-6 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 ${
                isLoading || !formData.username.trim() || !formData.password.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="text-purple-500 text-xl">💡</div>
                <div className="flex-1">
                  <h4 className="text-purple-800 font-medium mb-2">Demo Credentials</h4>
                  <div className="text-sm text-purple-700 space-y-1">
                    <p><strong>Username:</strong> admin</p>
                    <p><strong>Password:</strong> admin123</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="mt-3 text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
                    disabled={isLoading}
                  >
                    🎯 Use Demo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <Link 
                to="/"
                className="text-purple-600 hover:text-purple-800 transition duration-200 flex items-center space-x-1"
              >
                <span>←</span>
                <span>Back to Home</span>
              </Link>
              
              <div className="text-gray-500">
                Need help?
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 Gemstone Verification System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;