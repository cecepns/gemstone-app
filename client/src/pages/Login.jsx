// ANCHOR: LoginPage Component - Admin authentication interface with complete form handling
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    <div className="max-w-md mx-auto pt-15">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Admin Login
        </h1>
        <p className="text-gray-600">Enter your credentials to access the admin panel</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-xl">
        <Card.Body className="p-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert type="danger" title="Login Error">
                {error}
              </Alert>
            )}

            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter admin username"
              leftIcon={<User className="w-5 h-5" />}
              disabled={isLoading}
              required
              autoComplete="username"
              error={error && !formData.username.trim() ? 'Username harus diisi' : ''}
            />

            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter password"
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
                  Login to Dashboard
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
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;