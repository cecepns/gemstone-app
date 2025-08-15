// ANCHOR: LoginPage Component - Admin authentication interface with complete form handling
import { Rocket, User, Key, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Button, Input, Card } from '../components/ui';
import { useAuth } from '../context/useAuth';
import { loginAdmin } from '../utils/api';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';

const Login = () => {
  // Form state management
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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
      [name]: value,
    }));
  };

  /**
   * Validate form data
   * @returns {boolean} - True if form is valid
   */
  const validateForm = () => {
    if (!formData.username.trim()) {
      showError('Username harus diisi');
      return false;
    }

    if (!formData.password.trim()) {
      showError('Password harus diisi');
      return false;
    }

    if (formData.username.length < 3) {
      showError('Username minimal 3 karakter');
      return false;
    }

    if (formData.password.length < 6) {
      showError('Password minimal 6 karakter');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const loadingToast = showLoading('Sedang memproses login...');

    try {
      // Use API utility for login
      const result = await loginAdmin(
        formData.username.trim(),
        formData.password,
      );

      // Dismiss loading toast
      dismissToast(loadingToast);

      // Login successful - use AuthContext login function
      login(result.data.token, result.data.admin);

      // Navigate to admin dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);

      // Dismiss loading toast
      dismissToast(loadingToast);

      // Show error toast
      showError(error.message || 'Login gagal. Silakan periksa username dan password Anda.');
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
      password: 'admin123',
    });
    showSuccess('Demo credentials telah diisi. Silakan klik Login.');
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
    <div className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-sm sm:max-w-md md:max-w-lg mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            Login Admin
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-2">
            Masukkan kredensial Anda untuk mengakses panel admin
          </p>
        </div>

        {/* Login Form Card */}
        <Card size="md">
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
              <Input
                label="Nama Pengguna"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan nama pengguna admin"
                leftIcon={<User className="w-4 h-4 sm:w-5 sm:h-5" />}
                disabled={isLoading}
                required
                size="lg"
                autoComplete="username"
              />

              <Input
                label="Kata Sandi"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan kata sandi"
                leftIcon={<Key className="w-4 h-4 sm:w-5 sm:h-5" />}
                disabled={isLoading}
                required
                size="lg"
                autoComplete="current-password"
              />

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={!formData.username.trim() || !formData.password.trim()}
                >
                  {!isLoading && (
                    <>
                      Login ke Dashboard
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  Demo Login
                </Button>
              </div>
            </form>

            {/* Footer Section */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex justify-center items-center">
                <Link
                  to="/"
                  className="text-purple-600 hover:text-purple-800 transition duration-200 flex items-center space-x-2 text-sm sm:text-base md:text-lg hover:scale-105 transform"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Kembali ke Beranda</span>
                </Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;
