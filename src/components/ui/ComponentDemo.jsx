import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Card,
  Badge,
  Modal,
  Alert
} from './index';

/**
 * ANCHOR: Component Demo
 * A comprehensive demo showcasing all atomic UI components
 */
const ComponentDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '',
    newsletter: false,
    notifications: 'email',
    description: ''
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setIsModalOpen(true);
  };
  
  const selectOptions = [
    { value: '', label: 'Select a category' },
    { value: 'general', label: 'General' },
    { value: 'support', label: 'Support' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'bug', label: 'Bug Report' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demo Komponen UI
          </h1>
          <p className="text-gray-600">
            Pameran komprehensif dari semua komponen UI atomik
          </p>
        </div>
        
        {/* Alerts Section */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-xl font-semibold">Peringatan</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <Alert type="info" title="Informasi">
                Ini adalah peringatan informasi dengan judul.
              </Alert>
              
              <Alert type="success" title="Berhasil" dismissible>
                Ini adalah peringatan sukses yang dapat ditutup.
              </Alert>
              
              <Alert type="warning" title="Peringatan">
                Ini adalah peringatan peringatan.
              </Alert>
              
              <Alert type="danger" title="Error">
                Ini adalah peringatan error.
              </Alert>
              
              {showAlert && (
                <Alert 
                  type="success" 
                  title="Form Terkirim!" 
                  dismissible
                  onDismiss={() => setShowAlert(false)}
                >
                  Form Anda telah berhasil dikirim.
                </Alert>
              )}
            </div>
          </Card.Body>
        </Card>
        
        {/* Buttons Section */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-xl font-semibold">Tombol</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Varian</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Utama</Button>
                  <Button variant="secondary">Sekunder</Button>
                  <Button variant="outline">Garis</Button>
                  <Button variant="danger">Bahaya</Button>
                  <Button variant="success">Sukses</Button>
                  <Button variant="ghost">Hantu</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Ukuran</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Kecil</Button>
                  <Button size="md">Sedang</Button>
                  <Button size="lg">Besar</Button>
                  <Button size="xl">Sangat Besar</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Status</h3>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Memuat</Button>
                  <Button disabled>Dinonaktifkan</Button>
                  <Button fullWidth>Lebar Penuh</Button>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        {/* Form Components Section */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-xl font-semibold">Komponen Form</h2>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nama"
                  placeholder="Masukkan nama Anda"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <Select
                label="Kategori"
                placeholder="Pilih kategori"
                options={selectOptions}
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              />
              
              <Textarea
                label="Pesan"
                placeholder="Masukkan pesan Anda"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                maxLength={500}
                showCharacterCount
              />
              
              <div className="space-y-4">
                <Checkbox
                  label="Berlangganan newsletter"
                  checked={formData.newsletter}
                  onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                />
                
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Preferensi Notifikasi
                  </label>
                  <div className="space-y-2">
                    <Radio
                      label="Notifikasi email"
                      checked={formData.notifications === 'email'}
                      onChange={() => handleInputChange('notifications', 'email')}
                    />
                    <Radio
                      label="Notifikasi SMS"
                      checked={formData.notifications === 'sms'}
                      onChange={() => handleInputChange('notifications', 'sms')}
                    />
                    <Radio
                      label="Tidak ada notifikasi"
                      checked={formData.notifications === 'none'}
                      onChange={() => handleInputChange('notifications', 'none')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" variant="primary">
                  Kirim Form
                </Button>
                <Button type="button" variant="outline" onClick={() => setFormData({
                  name: '',
                  email: '',
                  message: '',
                  category: '',
                  newsletter: false,
                  notifications: 'email',
                  description: ''
                })}>
                  Reset Form
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
        
        {/* Badges Section */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-xl font-semibold">Lencana</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Varian</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Utama</Badge>
                  <Badge variant="success">Sukses</Badge>
                  <Badge variant="warning">Peringatan</Badge>
                  <Badge variant="danger">Bahaya</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="light">Terang</Badge>
                  <Badge variant="dark">Gelap</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Ukuran</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">Kecil</Badge>
                  <Badge size="md">Sedang</Badge>
                  <Badge size="lg">Besar</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Bulat</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge rounded>Bulat</Badge>
                  <Badge variant="primary" rounded>Utama Bulat</Badge>
                  <Badge variant="success" rounded>Sukses Bulat</Badge>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        {/* Modal Demo */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-xl font-semibold">Modal</h2>
          </Card.Header>
          <Card.Body>
            <Button onClick={() => setIsModalOpen(true)}>
              Buka Modal
            </Button>
          </Card.Body>
        </Card>
      </div>
      
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <Modal.Header onClose={() => setIsModalOpen(false)}>
          <h3 className="text-lg font-semibold">Detail Pengiriman Form</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <strong>Nama:</strong> {formData.name}
            </div>
            <div>
              <strong>Email:</strong> {formData.email}
            </div>
            <div>
              <strong>Kategori:</strong> {formData.category}
            </div>
            <div>
              <strong>Pesan:</strong> {formData.message}
            </div>
            <div>
              <strong>Newsletter:</strong> {formData.newsletter ? 'Ya' : 'Tidak'}
            </div>
            <div>
              <strong>Notifikasi:</strong> {formData.notifications}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Tutup
          </Button>
          <Button variant="primary">
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComponentDemo; 