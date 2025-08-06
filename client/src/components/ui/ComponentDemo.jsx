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
            UI Components Demo
          </h1>
          <p className="text-gray-600">
            A comprehensive showcase of all atomic UI components
          </p>
        </div>
        
        {/* Alerts Section */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-xl font-semibold">Alerts</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <Alert type="info" title="Information">
                This is an informational alert with a title.
              </Alert>
              
              <Alert type="success" title="Success" dismissible>
                This is a success alert that can be dismissed.
              </Alert>
              
              <Alert type="warning" title="Warning">
                This is a warning alert.
              </Alert>
              
              <Alert type="danger" title="Error">
                This is an error alert.
              </Alert>
              
              {showAlert && (
                <Alert 
                  type="success" 
                  title="Form Submitted!" 
                  dismissible
                  onDismiss={() => setShowAlert(false)}
                >
                  Your form has been submitted successfully.
                </Alert>
              )}
            </div>
          </Card.Body>
        </Card>
        
        {/* Buttons Section */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-xl font-semibold">Buttons</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button fullWidth>Full Width</Button>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        {/* Form Components Section */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-xl font-semibold">Form Components</h2>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <Select
                label="Category"
                placeholder="Select a category"
                options={selectOptions}
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              />
              
              <Textarea
                label="Message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                maxLength={500}
                showCharacterCount
              />
              
              <div className="space-y-4">
                <Checkbox
                  label="Subscribe to newsletter"
                  checked={formData.newsletter}
                  onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                />
                
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Notification Preferences
                  </label>
                  <div className="space-y-2">
                    <Radio
                      label="Email notifications"
                      checked={formData.notifications === 'email'}
                      onChange={() => handleInputChange('notifications', 'email')}
                    />
                    <Radio
                      label="SMS notifications"
                      checked={formData.notifications === 'sms'}
                      onChange={() => handleInputChange('notifications', 'sms')}
                    />
                    <Radio
                      label="No notifications"
                      checked={formData.notifications === 'none'}
                      onChange={() => handleInputChange('notifications', 'none')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" variant="primary">
                  Submit Form
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
            <h2 className="text-xl font-semibold">Badges</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="light">Light</Badge>
                  <Badge variant="dark">Dark</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Rounded</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge rounded>Rounded</Badge>
                  <Badge variant="primary" rounded>Primary Rounded</Badge>
                  <Badge variant="success" rounded>Success Rounded</Badge>
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
              Open Modal
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
          <h3 className="text-lg font-semibold">Form Submission Details</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <strong>Name:</strong> {formData.name}
            </div>
            <div>
              <strong>Email:</strong> {formData.email}
            </div>
            <div>
              <strong>Category:</strong> {formData.category}
            </div>
            <div>
              <strong>Message:</strong> {formData.message}
            </div>
            <div>
              <strong>Newsletter:</strong> {formData.newsletter ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Notifications:</strong> {formData.notifications}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary">
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComponentDemo; 