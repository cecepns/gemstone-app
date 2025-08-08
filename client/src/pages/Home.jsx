// ANCHOR: HomePage Component - Landing page for Gemstone Verification App
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button, Input, Card } from '../components/ui';

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
          Verifikasi Batu Mulia
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Verifikasi keaslian batu mulia berharga Anda dengan sistem verifikasi canggih kami
        </p>
      </div>

      <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-gray-100 max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Masukkan ID Batu Mulia"
            id="gemstoneId"
            name="gemstoneId"
            type="text"
            value={gemstoneId}
            onChange={handleInputChange}
            placeholder="e.g., GEM-1704067200000-A1B2C3"
            disabled={isLoading}
            required
            size="lg"
            className="bg-white/50 backdrop-blur-sm"
          />

          <div className="flex">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              loading={isLoading}
              className="shadow-lg"
            >
              {isLoading ? (
                'Memverifikasi...'
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Verifikasi Sekarang
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Home;