// ANCHOR: LoginPage Component - Admin authentication interface with complete form handling
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../utils/api';
import { Lock, AlertCircle, Loader2, Rocket, User, Key, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button, Input, Alert, Card } from '../components/ui';

const Login = () => {
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
      // Use API utility for login
      const result = await loginAdmin(
        formData.username.trim(),
        formData.password
      );

      // Login successful - use AuthContext login function
      login(result.data.token, result.data.admin);
      
      console.log('Login successful:', result.data.admin);
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login gagal. Silakan periksa username dan password Anda.');
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
    <div className="max-w-md mx-auto pt-15">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Login Admin
        </h1>
        <p className="text-gray-600">Masukkan kredensial Anda untuk mengakses panel admin</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-xl">
        <Card.Body className="p-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert type="danger" title="Error Login">
                {error}
              </Alert>
            )}

            <Input
              label="Nama Pengguna"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Masukkan nama pengguna admin"
              leftIcon={<User className="w-5 h-5" />}
              disabled={isLoading}
              required
              autoComplete="username"
              error={error && !formData.username.trim() ? 'Username harus diisi' : ''}
            />

            <Input
              label="Kata Sandi"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Masukkan kata sandi"
              leftIcon={<Key className="w-5 h-5" />}
              disabled={isLoading}
              required
              autoComplete="current-password"
              error={error && !formData.password.trim() ? 'Password harus diisi' : ''}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!formData.username.trim() || !formData.password.trim()}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {!isLoading && (
                <>
                  <Rocket className="w-5 h-5 mr-2" />
                  Login ke Dashboard
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <Link 
                to="/"
                className="text-purple-600 hover:text-purple-800 transition duration-200 flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;