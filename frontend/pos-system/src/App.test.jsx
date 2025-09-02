import React from 'react';
import { render, screen, waitFor } from './utils/test-utils';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock the lazy-loaded components
jest.mock('./features/auth/pages/LoginPage', () => {
  return function MockLoginPage() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('./features/outlet/pages/OutletPage', () => {
  return function MockOutletPage() {
    return <div data-testid="outlet-page">Outlet Page</div>;
  };
});

jest.mock('./features/factory/pages/FactoryStaffPage', () => {
  return function MockFactoryStaffPage() {
    return <div data-testid="factory-staff-page">Factory Staff Page</div>;
  };
});

jest.mock('./features/owner/pages/OwnerPage', () => {
  return function MockOwnerPage() {
    return <div data-testid="owner-page">Owner Page</div>;
  };
});

jest.mock('./components/TailwindTest', () => {
  return function MockTailwindTest() {
    return <div data-testid="tailwind-test">Tailwind Test</div>;
  };
});

// Mock environment variables
const originalEnv = process.env;

describe('App Component', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Routing', () => {
    test('redirects from root to owner page', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('owner-page')).toBeInTheDocument();
      });
    });

    test('renders owner page at /owner route', async () => {
      render(
        <MemoryRouter initialEntries={['/owner']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('owner-page')).toBeInTheDocument();
      });
    });

    test('renders outlet page at /outlet route', async () => {
      render(
        <MemoryRouter initialEntries={['/outlet']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('outlet-page')).toBeInTheDocument();
      });
    });

    test('renders factory staff page at /factory-staff route', async () => {
      render(
        <MemoryRouter initialEntries={['/factory-staff']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('factory-staff-page')).toBeInTheDocument();
      });
    });

    test('renders tailwind test page at /tailwind-test route', async () => {
      render(
        <MemoryRouter initialEntries={['/tailwind-test']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tailwind-test')).toBeInTheDocument();
      });
    });

    test('redirects unknown routes to owner page', async () => {
      render(
        <MemoryRouter initialEntries={['/unknown-route']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('owner-page')).toBeInTheDocument();
      });
    });
  });

  describe('Development Features', () => {
    test('shows dev navigation in development mode', async () => {
      process.env.NODE_ENV = 'development';
      
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('dev-navigation')).toBeInTheDocument();
      });
    });

    test('shows performance monitor in development mode', async () => {
      process.env.NODE_ENV = 'development';
      
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Performance Monitor')).toBeInTheDocument();
        expect(screen.getByText('Code Splitting: Active')).toBeInTheDocument();
        expect(screen.getByText('Lazy Loading: Enabled')).toBeInTheDocument();
        expect(screen.getByText('Build: Optimized')).toBeInTheDocument();
        expect(screen.getByText('Auth: Bypassed (Dev)')).toBeInTheDocument();
        expect(screen.getByText('Tailwind: Configured')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    test('shows loading spinner while components are loading', async () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      // Initially should show loading
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders without crashing', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('has proper accessibility attributes', async () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles component loading errors gracefully', async () => {
      // Mock a component that throws an error
      jest.doMock('./features/owner/pages/OwnerPage', () => {
        return function MockOwnerPage() {
          throw new Error('Test error');
        };
      });

      render(
        <MemoryRouter initialEntries={['/owner']}>
          <App />
        </MemoryRouter>
      );

      // Should not crash the app
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });
  });
});
