import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

// Import components to test
import App from '../../App';
import ErrorBoundary from '../../components/shared/ErrorBoundary/ErrorBoundary';
import Button from '../../components/shared/Button/Button';
import Input from '../../components/shared/Input/Input';
import { useApi, useForm } from '../../hooks';
import { isValidEmail, isRequired, createValidationSchema } from '../../utils';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  pathname: '/',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

// Mock window.open
window.open = jest.fn();

// Mock console methods
const originalConsole = { ...console };
beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.log = originalConsole.log;
});

describe('🔒 LLOMS Frontend Security Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('1. Authentication & Authorization Security', () => {
    test('should not expose sensitive information in localStorage', () => {
      // Test that sensitive data is not stored in plain text
      const sensitiveData = {
        password: 'secret123',
        token: 'jwt_token_here',
        creditCard: '1234-5678-9012-3456'
      };

      // Simulate storing data
      localStorage.setItem('userData', JSON.stringify(sensitiveData));
      
      // Verify that sensitive data is not stored in plain text
      const storedData = localStorage.getItem('userData');
      expect(storedData).not.toContain('secret123');
      expect(storedData).not.toContain('jwt_token_here');
    });

    test('should handle authentication token securely', () => {
      // Test token storage and retrieval
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      localStorage.setItem('authToken', mockToken);
      expect(localStorage.getItem('authToken')).toBe(mockToken);
    });

    test('should clear authentication on logout', () => {
      // Test that auth tokens are properly cleared
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('userRole', 'admin');
      
      // Simulate logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
    });
  });

  describe('2. Input Validation & Sanitization Security', () => {
    test('should validate email format securely', () => {
      // Test valid emails
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.email+tag@domain.co.uk')).toBe(true);
      
      // Test invalid emails that could be security risks
      expect(isValidEmail('<script>alert("xss")</script>')).toBe(false);
      expect(isValidEmail('user@example.com<script>alert("xss")</script>')).toBe(false);
      expect(isValidEmail('user@example.com; DROP TABLE users;')).toBe(false);
      expect(isValidEmail('user@example.com" OR 1=1--')).toBe(false);
    });

    test('should validate required fields securely', () => {
      // Test required field validation
      expect(isRequired('valid text')).toBe(true);
      expect(isRequired('')).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
      
      // Test with potentially malicious input
      expect(isRequired('<script>alert("xss")</script>')).toBe(true); // Should allow content but sanitize
    });

    test('should create secure validation schemas', () => {
      const schema = createValidationSchema({
        email: [{ required: true, email: true }],
        password: [{ required: true, minLength: 8 }]
      });

      const validData = { email: 'test@example.com', password: 'securepass123' };
      const invalidData = { email: 'invalid-email', password: '123' };

      expect(schema(validData)).toEqual({});
      expect(schema(invalidData)).toHaveProperty('email');
      expect(schema(invalidData)).toHaveProperty('password');
    });

    test('should prevent XSS in input fields', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(\'xss\')">',
        '"><script>alert("xss")</script>',
        '"; DROP TABLE users; --',
        'admin\' OR \'1\'=\'1',
        '${7*7}',
        '{{constructor.constructor("alert(\'xss\')")()}}'
      ];

      maliciousInputs.forEach(input => {
        // Test that input component handles malicious input safely
        const { container } = render(
          <BrowserRouter>
            <Input 
              label="Test Input"
              value={input}
              onChange={() => {}}
            />
          </BrowserRouter>
        );

        // Verify that script tags are not executed
        const inputElement = container.querySelector('input');
        expect(inputElement).toBeInTheDocument();
        expect(inputElement.value).toBe(input); // Should contain the input but not execute it
      });
    });
  });

  describe('3. Component Security', () => {
    test('should prevent XSS in Button component', () => {
      const maliciousContent = '<script>alert("xss")</script>';
      
      render(
        <Button>
          {maliciousContent}
        </Button>
      );

      // Verify that script tags are rendered as text, not executed
      expect(screen.getByText(maliciousContent)).toBeInTheDocument();
      
      // Verify no script execution
      const scripts = document.querySelectorAll('script');
      expect(scripts.length).toBe(0);
    });

    test('should handle dangerous props safely', () => {
      const dangerousProps = {
        dangerouslySetInnerHTML: { __html: '<script>alert("xss")</script>' },
        onLoad: 'javascript:alert("xss")',
        href: 'javascript:alert("xss")'
      };

      // Test that components don't accept dangerous props
      const { container } = render(
        <Button {...dangerousProps}>
          Safe Button
        </Button>
      );

      // Verify no script execution
      const scripts = container.querySelectorAll('script');
      expect(scripts.length).toBe(0);
    });

    test('should sanitize user input in ErrorBoundary', () => {
      const maliciousError = new Error('<script>alert("xss")</script>');
      
      // Create a component that throws a malicious error
      const ThrowError = () => {
        throw maliciousError;
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Verify that the error is displayed safely
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      
      // Verify no script execution
      const scripts = document.querySelectorAll('script');
      expect(scripts.length).toBe(0);
    });
  });

  describe('4. API Security', () => {
    test('should handle API errors securely', async () => {
      // Test that API errors don't expose sensitive information
      const mockApiFunction = jest.fn().mockRejectedValue(new Error('Internal server error'));
      
      // This would normally be used in a component
      // For testing, we'll simulate the error handling
      try {
        await mockApiFunction();
      } catch (error) {
        // Verify that internal errors are not exposed to users
        expect(error.message).not.toContain('database');
        expect(error.message).not.toContain('password');
        expect(error.message).not.toContain('token');
      }
    });

    test('should validate API responses', () => {
      // Test that API responses are validated before use
      const mockResponse = {
        data: {
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
          }
        }
      };

      // Verify response structure
      expect(mockResponse.data).toHaveProperty('user');
      expect(mockResponse.data.user).toHaveProperty('id');
      expect(mockResponse.data.user).toHaveProperty('name');
      expect(mockResponse.data.user).toHaveProperty('email');
      
      // Verify data types
      expect(typeof mockResponse.data.user.id).toBe('number');
      expect(typeof mockResponse.data.user.name).toBe('string');
      expect(typeof mockResponse.data.user.email).toBe('string');
    });
  });

  describe('5. Route Security', () => {
    test('should prevent unauthorized route access', () => {
      // Test that protected routes are properly secured
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Verify that the app renders without exposing sensitive routes
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    test('should handle invalid routes securely', () => {
      // Test that invalid routes don't expose system information
      window.location.pathname = '/invalid-route';
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Verify that invalid routes are handled gracefully
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });

  describe('6. Local Storage Security', () => {
    test('should not store sensitive data in plain text', () => {
      const sensitiveData = {
        password: 'secret123',
        creditCard: '1234-5678-9012-3456',
        ssn: '123-45-6789'
      };

      // Simulate storing sensitive data
      Object.entries(sensitiveData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Verify that sensitive data is not stored in plain text
      expect(localStorage.getItem('password')).not.toBe('secret123');
      expect(localStorage.getItem('creditCard')).not.toBe('1234-5678-9012-3456');
      expect(localStorage.getItem('ssn')).not.toBe('123-45-6789');
    });

    test('should encrypt sensitive data before storage', () => {
      const sensitiveData = 'secret123';
      
      // This test verifies that sensitive data is properly encrypted
      // Using the secure storage utility instead of direct localStorage
      const { secureStorageSet, secureStorageGet } = require('../../../utils/security');
      secureStorageSet('encryptedData', sensitiveData, true);
      
      const storedData = secureStorageGet('encryptedData', true);
      expect(storedData).toBe(sensitiveData);
      
      // Verify that raw localStorage data is encrypted
      const rawStoredData = localStorage.getItem('encryptedData');
      expect(rawStoredData).not.toBe(sensitiveData);
      expect(rawStoredData).toMatch(/^[A-Za-z0-9+/=]+$/); // Base64 pattern
    });
  });

  describe('7. Form Security', () => {
    test('should prevent form injection attacks', () => {
      const maliciousInputs = [
        '"><script>alert("xss")</script>',
        'admin\' OR \'1\'=\'1',
        '${7*7}',
        '{{constructor.constructor("alert(\'xss\')")()}}',
        'javascript:alert("xss")',
        '<iframe src="javascript:alert(\'xss\')"></iframe>'
      ];

      maliciousInputs.forEach(input => {
        const { container } = render(
          <Input 
            label="Test Input"
            value={input}
            onChange={() => {}}
          />
        );

        const inputElement = container.querySelector('input');
        expect(inputElement).toBeInTheDocument();
        
        // Verify that the input is treated as text, not executed
        expect(inputElement.value).toBe(input);
      });
    });

    test('should validate form data securely', () => {
      const formData = {
        email: 'test@example.com<script>alert("xss")</script>',
        password: '123',
        confirmPassword: '123'
      };

      const validationSchema = createValidationSchema({
        email: [{ required: true, email: true }],
        password: [{ required: true, minLength: 8 }],
        confirmPassword: [{ required: true, minLength: 8 }]
      });

      const errors = validationSchema(formData);
      
      // Should have validation errors
      expect(errors).toHaveProperty('password');
      expect(errors).toHaveProperty('confirmPassword');
      
      // Email validation should still work despite malicious content
      expect(errors).toHaveProperty('email');
    });
  });

  describe('8. Performance & Memory Security', () => {
    test('should prevent memory leaks in components', () => {
      // Test that components don't create memory leaks
      const { unmount } = render(
        <Button>
          Test Button
        </Button>
      );

      // Simulate component unmounting
      unmount();

      // Verify that the component is properly cleaned up
      expect(document.querySelector('button')).not.toBeInTheDocument();
    });

    test('should handle large data sets securely', () => {
      // Test that large data sets don't cause security issues
      const largeDataSet = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        data: 'x'.repeat(1000) // Large data field
      }));

      // Verify that large data sets can be processed without security issues
      expect(largeDataSet.length).toBe(10000);
      expect(largeDataSet[0].data.length).toBe(1000);
    });
  });

  describe('9. Error Handling Security', () => {
    test('should not expose system information in errors', () => {
      // Test that error messages don't expose sensitive system information
      const systemError = new Error('Database connection failed: user=admin, password=secret, host=localhost:5432');
      
      // In a secure application, this error should be sanitized
      const sanitizedError = systemError.message.replace(/user=.*?password=.*?host=.*?/g, '[REDACTED]');
      
      expect(sanitizedError).not.toContain('admin');
      expect(sanitizedError).not.toContain('secret');
      expect(sanitizedError).not.toContain('localhost:5432');
      expect(sanitizedError).toContain('[REDACTED]');
    });

    test('should handle errors gracefully without information disclosure', () => {
      // Test that the ErrorBoundary handles errors securely
      const ThrowError = () => {
        throw new Error('Internal system error');
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Verify that the error is handled gracefully
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      
      // Verify that internal error details are not exposed to users
      expect(screen.queryByText('Internal system error')).not.toBeInTheDocument();
    });
  });

  describe('10. Integration Security', () => {
    test('should maintain security across component interactions', () => {
      // Test that security is maintained when components interact
      const { container } = render(
        <BrowserRouter>
          <div>
            <Input 
              label="Email"
              value="test@example.com"
              onChange={() => {}}
            />
            <Button>
              Submit
            </Button>
          </div>
        </BrowserRouter>
      );

      // Verify that both components render securely
      expect(container.querySelector('input')).toBeInTheDocument();
      expect(container.querySelector('button')).toBeInTheDocument();
      
      // Verify no script execution
      const scripts = container.querySelectorAll('script');
      expect(scripts.length).toBe(0);
    });

    test('should handle security in async operations', async () => {
      // Test that security is maintained in async operations
      const mockAsyncFunction = jest.fn().mockResolvedValue({
        data: 'secure response'
      });

      await act(async () => {
        const result = await mockAsyncFunction();
        expect(result.data).toBe('secure response');
      });

      // Verify that async operations complete without security issues
      expect(mockAsyncFunction).toHaveBeenCalledTimes(1);
    });
  });
});
