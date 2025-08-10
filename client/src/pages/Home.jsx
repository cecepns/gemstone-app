// ANCHOR: HomePage Component - Landing page for Gemstone Verification App
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
            Verifikasi Batu Mulia
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            Verifikasi keaslian batu mulia berharga Anda dengan sistem verifikasi canggih kami
          </p>
        </div>

        {/* Form Card */}
        <Card
          variant="elevated"
          padding="lg"
          className="bg-white/80 backdrop-blur-sm border-gray-100 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading}
                loading={isLoading}
                className="shadow-lg h-12 sm:h-14 text-base sm:text-lg font-semibold"
              >
                {isLoading ? (
                  'Memverifikasi...'
                ) : (
                  <>
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Verifikasi Sekarang
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Home;
