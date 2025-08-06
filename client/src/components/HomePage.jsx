// ANCHOR: HomePage Component - Landing page for Gemstone Verification App
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  // State management for user input
  const [gemstoneId, setGemstoneId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Navigation hook
  const navigate = useNavigate();

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!gemstoneId.trim()) {
      alert('Silakan masukkan ID Gemstone');
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    // Navigate to verification page
    setTimeout(() => {
      navigate(`/verify/${gemstoneId.trim()}`);
      setIsLoading(false);
    }, 500); // Small delay for better UX
  };

  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    setGemstoneId(e.target.value);
  };

  /**
   * Handle demo verification with sample ID
   */
  const handleDemoVerification = () => {
    const sampleId = 'GEM-1704067200000-A1B2C3';
    setGemstoneId(sampleId);
    setTimeout(() => {
      navigate(`/verify/${sampleId}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            New Verification
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-display">
            Verify your gemstone in
          </h1>
          <h1 className="text-5xl font-bold text-purple-700 mb-6 font-display">
            Seconds with AI
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Advanced gemstone verification system powered by blockchain technology and AI authentication
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Verification Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">🔍</span>
                </div>
                Certificate Verification
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Enter the unique gemstone ID or scan QR code to verify the authenticity of your certificate.
              </p>
              
              {/* Verification Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="gemstoneId" className="block text-sm font-medium text-gray-700 mb-2">
                    Gemstone ID
                  </label>
                  <input
                    id="gemstoneId"
                    type="text"
                    value={gemstoneId}
                    onChange={handleInputChange}
                    placeholder="Enter Gemstone ID (e.g., GEM-1234567890-ABC123)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-500 bg-white/50 backdrop-blur-sm"
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={isLoading || !gemstoneId.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition duration-200 flex items-center justify-center ${
                    isLoading || !gemstoneId.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      🔍 Verify Now
                    </>
                  )}
                </button>
              </form>
              
              {/* Demo Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleDemoVerification}
                  className="w-full bg-purple-50 text-purple-700 py-3 px-4 rounded-xl hover:bg-purple-100 transition duration-200 text-sm font-medium border border-purple-200"
                >
                  🎯 Try with Demo Data
                </button>
              </div>
            </div>

            {/* QR Scanner Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">📱</span>
                </div>
                QR Code Scanner
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Use your camera to scan the QR code printed on the gemstone certificate.
              </p>
              
              {/* QR Scanner Placeholder */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-dashed border-purple-300 rounded-xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3 animate-bounce">📸</div>
                  <p className="text-purple-700 font-medium">QR Code Scanner</p>
                  <p className="text-sm text-purple-500">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              ✨ Premium Features
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition duration-200">
                  <span className="text-2xl">🔐</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Guaranteed Security</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Each gemstone has a unique ID that cannot be counterfeited
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition duration-200">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Fast Verification</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Verification process takes only a few seconds
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition duration-200">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Complete Data</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Detailed information about gemstone specifications and origin
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-200/50">
          <p className="text-gray-500">
            © 2024 Gemstone Verification System. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;