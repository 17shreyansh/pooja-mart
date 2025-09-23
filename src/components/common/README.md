# Loading Components Documentation

This directory contains reusable loading components for the PujaMart frontend application.

## Components

### 1. LoadingSpinner
A versatile spinner component that can be used inline or as an overlay.

**Usage:**
```jsx
import LoadingSpinner from './components/common/LoadingSpinner';

// Inline loading
<LoadingSpinner size="medium" message="Loading content..." />

// Overlay loading
<LoadingSpinner overlay={true} message="Processing request..." />

// Different sizes
<LoadingSpinner size="small" />
<LoadingSpinner size="medium" />
<LoadingSpinner size="large" />
```

**Props:**
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `overlay`: boolean (default: false) - Shows as full-screen overlay
- `message`: string (default: 'Loading...') - Loading message text
- `showMessage`: boolean (default: true) - Whether to show the message

### 2. PageLoader
A full-page loading component for initial page loads with branding.

**Usage:**
```jsx
import PageLoader from './components/common/PageLoader';

<PageLoader message="Loading PujaMart..." />
```

**Props:**
- `message`: string (default: 'Loading PujaMart...') - Loading message

### 3. LoadingButton
An enhanced button component with loading states.

**Usage:**
```jsx
import LoadingButton from './components/common/LoadingButton';

<LoadingButton 
  loading={isSubmitting}
  loadingText="Submitting..."
  type="primary"
  onClick={handleSubmit}
>
  Submit Form
</LoadingButton>
```

**Props:**
- `loading`: boolean (default: false) - Loading state
- `loadingText`: string (default: 'Loading...') - Text shown during loading
- All other Ant Design Button props are supported

## Hooks

### useLoading
A custom hook for managing loading states in components.

**Usage:**
```jsx
import { useLoading } from '../utils/useLoading';

const MyComponent = () => {
  const { isLoading, startLoading, stopLoading, withLoading } = useLoading();

  const handleAction = async () => {
    await withLoading(async () => {
      // Your async operation
      await api.fetchData();
    }, 'Fetching data...');
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <button onClick={handleAction}>Load Data</button>
    </div>
  );
};
```

### useGlobalLoading
A context hook for global loading states across the application.

**Usage:**
```jsx
import { useGlobalLoading } from '../utils/LoadingContext';

const MyComponent = () => {
  const { showLoading, hideLoading, withLoading } = useGlobalLoading();

  const handleGlobalAction = async () => {
    await withLoading(async () => {
      // Your async operation
      await api.submitForm();
    }, 'Submitting form...');
  };

  return <button onClick={handleGlobalAction}>Submit</button>;
};
```

## Context Provider

### LoadingProvider
Wrap your app with LoadingProvider to enable global loading states.

**Usage:**
```jsx
import { LoadingProvider } from './utils/LoadingContext';

function App() {
  return (
    <LoadingProvider>
      {/* Your app components */}
    </LoadingProvider>
  );
}
```

## API Wrappers

### API with Loading
Enhanced API functions that include loading messages.

**Usage:**
```jsx
import { frontendAPIWithLoading } from '../utils/apiWithLoading';

const fetchPoojas = async () => {
  try {
    const response = await frontendAPIWithLoading.getPoojas();
    // Handle response
  } catch (error) {
    // Handle error
  }
};
```

## Design System

All loading components follow the PujaMart design system:

- **Colors**: Orange/amber theme (#ff6b35, #fbbf24, #f7931e)
- **Typography**: Poppins font family
- **Animations**: Smooth transitions and rotations
- **Responsive**: Mobile-first design approach

## Best Practices

1. **Use appropriate loading types:**
   - `LoadingSpinner` with `overlay={true}` for page-level loading
   - `LoadingSpinner` inline for section loading
   - `LoadingButton` for form submissions
   - `PageLoader` for initial app loading

2. **Provide meaningful messages:**
   ```jsx
   <LoadingSpinner message="Loading your poojas..." />
   <LoadingButton loadingText="Booking your pooja...">Book Now</LoadingButton>
   ```

3. **Handle loading states properly:**
   ```jsx
   const [loading, setLoading] = useState(false);
   
   const handleSubmit = async () => {
     setLoading(true);
     try {
       await api.submit();
     } finally {
       setLoading(false);
     }
   };
   ```

4. **Use global loading for app-wide operations:**
   ```jsx
   const { withLoading } = useGlobalLoading();
   
   const handleGlobalOperation = () => {
     withLoading(async () => {
       await heavyOperation();
     }, 'Processing...');
   };
   ```

## Examples

### Page with Loading
```jsx
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getData();
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner overlay={true} message="Loading page content..." />;
  }

  return <div>{/* Your page content */}</div>;
};
```

### Form with Loading Button
```jsx
import React, { useState } from 'react';
import { Form, Input } from 'antd';
import LoadingButton from '../components/common/LoadingButton';

const MyForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await api.submitForm(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item name="name">
        <Input placeholder="Name" />
      </Form.Item>
      <LoadingButton 
        type="primary" 
        htmlType="submit"
        loading={submitting}
        loadingText="Submitting..."
      >
        Submit
      </LoadingButton>
    </Form>
  );
};
```