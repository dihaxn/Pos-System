import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/test-utils';
import Layout from './Layout';

// Mock SockJS and Stomp
jest.mock('sockjs-client', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    close: jest.fn(),
  })),
}));

jest.mock('stompjs', () => ({
  __esModule: true,
  default: {
    over: jest.fn(() => ({
      connect: jest.fn(),
      subscribe: jest.fn(),
      disconnect: jest.fn(),
      connected: false,
    })),
  },
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

describe('Layout Component', () => {
  const defaultProps = {
    children: <div data-testid="test-children">Test Content</div>,
    navItemList: [
      { id: 1, name: 'Dashboard', path: '/dashboard' },
      { id: 2, name: 'Orders', path: '/orders' },
    ],
    user: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders without crashing', () => {
      render(<Layout {...defaultProps} />);
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    test('renders sidebar', () => {
      render(<Layout {...defaultProps} />);
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('renders main content area', () => {
      render(<Layout {...defaultProps} />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('renders toaster', () => {
      render(<Layout {...defaultProps} />);
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });

    test('displays user name in sidebar', () => {
      render(<Layout {...defaultProps} />);
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  describe('Sidebar Functionality', () => {
    test('sidebar is closed by default', () => {
      render(<Layout {...defaultProps} />);
      
      const mainContent = screen.getByRole('main');
      expect(mainContent).toHaveClass('pl-16'); // Default closed state
    });

    test('toggles sidebar when toggle button is clicked', () => {
      render(<Layout {...defaultProps} />);
      
      const toggleButton = screen.getByTestId('sidebar-toggle');
      const mainContent = screen.getByRole('main');
      
      // Initially closed
      expect(mainContent).toHaveClass('pl-16');
      
      // Click to open
      fireEvent.click(toggleButton);
      expect(mainContent).toHaveClass('pl-90');
      
      // Click to close
      fireEvent.click(toggleButton);
      expect(mainContent).toHaveClass('pl-16');
    });

    test('sidebar has proper width classes', () => {
      render(<Layout {...defaultProps} />);
      
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('WebSocket Functionality', () => {
    test('attempts to connect to WebSocket on mount', async () => {
      const mockStomp = require('stompjs').default;
      const mockSockJS = require('sockjs-client').default;
      
      render(<Layout {...defaultProps} />);
      
      await waitFor(() => {
        expect(mockSockJS).toHaveBeenCalledWith('http://localhost:8087/ws');
        expect(mockStomp.over).toHaveBeenCalled();
      });
    });

    test('handles WebSocket connection errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(<Layout {...defaultProps} />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });
      
      consoleSpy.mockRestore();
    });

    test('subscribes to notifications topic on successful connection', async () => {
      const mockStomp = require('stompjs').default;
      const mockStompInstance = {
        connect: jest.fn((options, successCallback) => {
          successCallback(); // Simulate successful connection
        }),
        subscribe: jest.fn(),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      render(<Layout {...defaultProps} />);
      
      await waitFor(() => {
        expect(mockStompInstance.subscribe).toHaveBeenCalledWith('/topic/notifications', expect.any(Function));
      });
    });
  });

  describe('Layout Structure', () => {
    test('has proper flexbox layout', () => {
      render(<Layout {...defaultProps} />);
      
      const container = screen.getByTestId('test-children').closest('div').parentElement.parentElement;
      expect(container).toHaveClass('flex', 'h-screen');
    });

    test('main content has proper styling', () => {
      render(<Layout {...defaultProps} />);
      
      const mainContent = screen.getByRole('main');
      expect(mainContent).toHaveClass('px-5', 'py-2', 'bg-white', 'h-full');
    });

    test('has proper transition classes', () => {
      render(<Layout {...defaultProps} />);
      
      const mainContent = screen.getByRole('main').parentElement;
      expect(mainContent).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('Responsive Design', () => {
    test('applies responsive padding based on sidebar state', () => {
      render(<Layout {...defaultProps} />);
      
      const mainContent = screen.getByRole('main').parentElement;
      
      // Default state (closed)
      expect(mainContent).toHaveClass('pl-16');
      
      // Toggle to open
      const toggleButton = screen.getByTestId('sidebar-toggle');
      fireEvent.click(toggleButton);
      expect(mainContent).toHaveClass('pl-90');
    });

    test('has proper height classes', () => {
      render(<Layout {...defaultProps} />);
      
      const container = screen.getByTestId('test-children').closest('div').parentElement.parentElement;
      expect(container).toHaveClass('h-screen');
    });
  });

  describe('Props Handling', () => {
    test('renders children correctly', () => {
      const customChildren = <div data-testid="custom-children">Custom Content</div>;
      render(<Layout {...defaultProps} children={customChildren} />);
      
      expect(screen.getByTestId('custom-children')).toBeInTheDocument();
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();
    });

    test('uses default navItemList when not provided', () => {
      render(<Layout children={defaultProps.children} user={defaultProps.user} />);
      
      // Should still render without crashing
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    test('uses default user when not provided', () => {
      render(<Layout children={defaultProps.children} navItemList={defaultProps.navItemList} />);
      
      // Should use default user
      expect(screen.getByText('Mathara Outlet')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper main landmark', () => {
      render(<Layout {...defaultProps} />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    test('has proper button roles', () => {
      render(<Layout {...defaultProps} />);
      
      const toggleButton = screen.getByTestId('sidebar-toggle');
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles WebSocket initialization errors', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Mock SockJS to throw an error
      const mockSockJS = require('sockjs-client').default;
      mockSockJS.mockImplementation(() => {
        throw new Error('WebSocket error');
      });
      
      render(<Layout {...defaultProps} />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize WebSocket:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    test('handles notification parsing errors', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const mockStomp = require('stompjs').default;
      
      const mockStompInstance = {
        connect: jest.fn((options, successCallback) => {
          successCallback(); // Simulate successful connection
        }),
        subscribe: jest.fn((topic, callback) => {
          // Simulate malformed notification
          callback({ body: 'invalid json' });
        }),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      render(<Layout {...defaultProps} />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to parse notification:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Cleanup', () => {
    test('disconnects WebSocket on unmount', async () => {
      const mockStomp = require('stompjs').default;
      const mockStompInstance = {
        connect: jest.fn(),
        subscribe: jest.fn(),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      const { unmount } = render(<Layout {...defaultProps} />);
      
      unmount();
      
      expect(mockStompInstance.disconnect).toHaveBeenCalled();
    });

    test('handles disconnect errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const mockStomp = require('stompjs').default;
      
      const mockStompInstance = {
        connect: jest.fn(),
        subscribe: jest.fn(),
        disconnect: jest.fn(() => {
          throw new Error('Disconnect error');
        }),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      const { unmount } = render(<Layout {...defaultProps} />);
      
      unmount();
      
      expect(consoleSpy).toHaveBeenCalledWith('Error disconnecting WebSocket:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });
});
