# UI Components Library

A comprehensive collection of atomic UI components built with React and Tailwind CSS.

## Installation

All components are available in the `src/components/ui/` directory and can be imported individually or as a group.

```javascript
// Import individual components
import { Button, Input, Card } from './components/ui';

// Or import specific components
import Button from './components/ui/Button';
import Input from './components/ui/Input';
```

## Components

### Button

A versatile button component with multiple variants, sizes, and states.

```javascript
import { Button } from './components/ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="ghost">Ghost</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With states
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `disabled`: boolean
- `loading`: boolean
- `fullWidth`: boolean
- `onClick`: function
- `type`: 'button' | 'submit' | 'reset'

### Input

A flexible input component with validation states and icons.

```javascript
import { Input } from './components/ui';

// Basic usage
<Input label="Email" placeholder="Enter your email" />

// With validation
<Input 
  label="Email" 
  error="Please enter a valid email"
  success="Email is valid"
/>

// With icons
<Input 
  label="Search"
  leftIcon={<SearchIcon />}
  rightIcon={<ClearIcon />}
/>

// Different sizes
<Input size="sm" label="Small Input" />
<Input size="md" label="Medium Input" />
<Input size="lg" label="Large Input" />
```

**Props:**
- `label`: string
- `placeholder`: string
- `value`: string
- `onChange`: function
- `error`: string
- `success`: string
- `disabled`: boolean
- `required`: boolean
- `size`: 'sm' | 'md' | 'lg'
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `fullWidth`: boolean

### Textarea

A textarea component with character count and validation.

```javascript
import { Textarea } from './components/ui';

// Basic usage
<Textarea label="Message" placeholder="Enter your message" />

// With character count
<Textarea 
  label="Description"
  maxLength={500}
  showCharacterCount
/>

// With validation
<Textarea 
  label="Message"
  error="Message is required"
  rows={6}
/>
```

**Props:**
- `label`: string
- `placeholder`: string
- `value`: string
- `onChange`: function
- `error`: string
- `success`: string
- `disabled`: boolean
- `required`: boolean
- `size`: 'sm' | 'md' | 'lg'
- `rows`: number
- `maxLength`: number
- `showCharacterCount`: boolean

### Select

A select dropdown component with options and validation.

```javascript
import { Select } from './components/ui';

const options = [
  { value: '', label: 'Select an option' },
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' }
];

<Select 
  label="Category"
  options={options}
  value={selectedValue}
  onChange={handleChange}
/>
```

**Props:**
- `label`: string
- `placeholder`: string
- `value`: string
- `onChange`: function
- `options`: Array<{value: string, label: string, disabled?: boolean}>
- `error`: string
- `success`: string
- `disabled`: boolean
- `required`: boolean
- `size`: 'sm' | 'md' | 'lg'

### Checkbox

A checkbox component with various states.

```javascript
import { Checkbox } from './components/ui';

<Checkbox 
  label="Subscribe to newsletter"
  checked={isChecked}
  onChange={handleChange}
/>
```

**Props:**
- `label`: string
- `checked`: boolean
- `onChange`: function
- `error`: string
- `success`: string
- `disabled`: boolean
- `required`: boolean
- `size`: 'sm' | 'md' | 'lg'

### Radio

A radio button component for single selection.

```javascript
import { Radio } from './components/ui';

<Radio 
  label="Email notifications"
  checked={notifications === 'email'}
  onChange={() => setNotifications('email')}
/>
```

**Props:**
- `label`: string
- `checked`: boolean
- `onChange`: function
- `error`: string
- `success`: string
- `disabled`: boolean
- `required`: boolean
- `size`: 'sm' | 'md' | 'lg'

### Card

A card component with header, body, and footer sections.

```javascript
import { Card } from './components/ui';

<Card>
  <Card.Header>
    <h2>Card Title</h2>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'flat'
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `shadow`: 'none' | 'sm' | 'md' | 'lg' | 'xl'

### Badge

A badge component for labels and status indicators.

```javascript
import { Badge } from './components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="danger" rounded>New</Badge>
<Badge size="lg">Large Badge</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark'
- `size`: 'sm' | 'md' | 'lg'
- `rounded`: boolean

### Modal

A modal component with backdrop and animations.

```javascript
import { Modal } from './components/ui';

<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header onClose={handleClose}>
    <h3>Modal Title</h3>
  </Modal.Header>
  <Modal.Body>
    <p>Modal content goes here</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="outline" onClick={handleClose}>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Modal.Footer>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `size`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
- `closeOnBackdrop`: boolean
- `closeOnEscape`: boolean

### Alert

An alert component with different types and dismissible functionality.

```javascript
import { Alert } from './components/ui';

<Alert type="success" title="Success!" dismissible>
  Your action was completed successfully.
</Alert>

<Alert type="danger" title="Error">
  Something went wrong.
</Alert>
```

**Props:**
- `type`: 'info' | 'success' | 'warning' | 'danger' | 'default'
- `title`: string
- `dismissible`: boolean
- `onDismiss`: function

## Usage Examples

### Form with Validation

```javascript
import { Input, Button, Alert } from './components/ui';

const MyForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    setShowSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      {showSuccess && (
        <Alert type="success" title="Success!" dismissible>
          Form submitted successfully!
        </Alert>
      )}
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />
      
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
};
```

### Modal with Form

```javascript
import { Modal, Input, Button } from './components/ui';

const MyModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header onClose={() => setIsOpen(false)}>
          <h3>Add New User</h3>
        </Modal.Header>
        <Modal.Body>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
```

## Styling

All components use Tailwind CSS classes and can be customized by:

1. **Passing className prop**: Add custom classes to override default styling
2. **Modifying the component source**: Update the base classes in the component files
3. **Using CSS custom properties**: Define custom CSS variables for consistent theming

## Accessibility

Components include:
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills)
- Mobile browsers

## Contributing

When adding new components:
1. Follow the existing naming conventions
2. Include proper TypeScript types
3. Add comprehensive documentation
4. Include accessibility features
5. Test across different browsers 