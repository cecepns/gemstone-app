// ANCHOR: HomePage Component - Landing page for Gemstone Verification App
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Smartphone, Shield, Zap, BarChart3 } from 'lucide-react';

const Home = () => {
  const [gemstoneId, setGemstoneId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!gemstoneId.trim()) {
      alert('Silakan masukkan ID Gemstone');
      return;
    }
    
    setIsLoading(true);
    
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
    <div className="max-w-6xl mx-auto pt-15">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Gemstone Verification 
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Verify the authenticity of your precious gemstones with our advanced verification system
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto shadow-xl border border-gray-100 p-8 mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="gemstoneId" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Gemstone ID
            </label>
            <input
              type="text"
              id="gemstoneId"
              value={gemstoneId}
              onChange={handleInputChange}
              placeholder="e.g., GEM-1704067200000-A1B2C3"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="w-5 h-5" />
              )}
              Verify Now
            </button>
            
            <button
              type="button"
              onClick={handleDemoVerification}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl hover:from-gray-700 hover:to-gray-800 transition duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Smartphone className="w-5 h-5" />
              Try Demo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;