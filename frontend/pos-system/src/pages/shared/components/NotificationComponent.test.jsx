import React from 'react';
import { render, screen, waitFor } from '../../../utils/test-utils';
import NotificationComponent from './NotificationComponent';

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

describe('NotificationComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders without crashing', () => {
      render(<NotificationComponent />);
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    test('renders notifications heading', () => {
      render(<NotificationComponent />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Notifications');
    });

    test('renders empty notifications list initially', () => {
      render(<NotificationComponent />);
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.children).toHaveLength(0);
    });
  });

  describe('WebSocket Connection', () => {
    test('attempts to connect to WebSocket on mount', async () => {
      const mockStomp = require('stompjs').default;
      const mockSockJS = require('sockjs-client').default;
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(mockSockJS).toHaveBeenCalledWith('http://localhost:8087/ws');
        expect(mockStomp.over).toHaveBeenCalled();
      });
    });

    test('shows connection status when WebSocket fails', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Mock SockJS to throw an error
      const mockSockJS = require('sockjs-client').default;
      mockSockJS.mockImplementation(() => {
        throw new Error('WebSocket error');
      });
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(screen.getByText(/WebSocket connection unavailable/)).toBeInTheDocument();
      });
      
      consoleSpy.mockRestore();
    });

    test('shows connection status when connection fails', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const mockStomp = require('stompjs').default;
      
      const mockStompInstance = {
        connect: jest.fn((options, successCallback, errorCallback) => {
          errorCallback(new Error('Connection failed'));
        }),
        subscribe: jest.fn(),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(screen.getByText(/WebSocket connection unavailable/)).toBeInTheDocument();
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Notification Handling', () => {
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
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(mockStompInstance.subscribe).toHaveBeenCalledWith('/topic/notifications', expect.any(Function));
      });
    });

    test('adds new notifications to the list', async () => {
      const mockStomp = require('stompjs').default;
      
      const mockStompInstance = {
        connect: jest.fn((options, successCallback) => {
          successCallback(); // Simulate successful connection
        }),
        subscribe: jest.fn((topic, callback) => {
          // Simulate receiving a notification
          callback({
            body: JSON.stringify({
              userId: 1,
              message: 'Test notification',
              date: new Date().toISOString(),
            }),
          });
        }),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(screen.getByText('Test notification')).toBeInTheDocument();
        expect(screen.getByText('User 1:')).toBeInTheDocument();
      });
    });

    test('handles malformed notification data gracefully', async () => {
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
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to parse notification:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    test('displays multiple notifications correctly', async () => {
      const mockStomp = require('stompjs').default;
      
      const mockStompInstance = {
        connect: jest.fn((options, successCallback) => {
          successCallback(); // Simulate successful connection
        }),
        subscribe: jest.fn((topic, callback) => {
          // Simulate receiving multiple notifications
          callback({
            body: JSON.stringify({
              userId: 1,
              message: 'First notification',
              date: new Date().toISOString(),
            }),
          });
          
          callback({
            body: JSON.stringify({
              userId: 2,
              message: 'Second notification',
              date: new Date().toISOString(),
            }),
          });
        }),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(screen.getByText('First notification')).toBeInTheDocument();
        expect(screen.getByText('Second notification')).toBeInTheDocument();
        expect(screen.getByText('User 1:')).toBeInTheDocument();
        expect(screen.getByText('User 2:')).toBeInTheDocument();
      });
    });
  });

  describe('Notification Display', () => {
    test('displays notification message correctly', async () => {
      const mockStomp = require('stompjs').default;
      
      const mockStompInstance = {
        connect: jest.fn((options, successCallback) => {
          successCallback();
        }),
        subscribe: jest.fn((topic, callback) => {
          callback({
            body: JSON.stringify({
              userId: 123,
              message: 'Hello World',
              date: '2023-01-01T00:00:00.000Z',
            }),
          });
        }),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(screen.getByText('Hello World')).toBeInTheDocument();
        expect(screen.getByText('User 123:')).toBeInTheDocument();
      });
    });

    test('displays notification date correctly', async () => {
      const mockStomp = require('stompjs').default;
      const testDate = new Date('2023-01-01T12:00:00.000Z');
      
      const mockStompInstance = {
        connect: jest.fn((options, successCallback) => {
          successCallback();
        }),
        subscribe: jest.fn((topic, callback) => {
          callback({
            body: JSON.stringify({
              userId: 1,
              message: 'Test message',
              date: testDate.toISOString(),
            }),
          });
        }),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        const dateElement = screen.getByText(testDate.toLocaleString());
        expect(dateElement).toBeInTheDocument();
      });
    });

    test('displays notification items in list format', async () => {
      const mockStomp = require('stompjs').default;
      
      const mockStompInstance = {
        connect: jest.fn((options, successCallback) => {
          successCallback();
        }),
        subscribe: jest.fn((topic, callback) => {
          callback({
            body: JSON.stringify({
              userId: 1,
              message: 'Test notification',
              date: new Date().toISOString(),
            }),
          });
        }),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(1);
        
        const listItem = listItems[0];
        expect(listItem).toHaveTextContent('User 1:');
        expect(listItem).toHaveTextContent('Test notification');
      });
    });
  });

  describe('Connection Status Display', () => {
    test('shows connection unavailable message when WebSocket fails', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const mockSockJS = require('sockjs-client').default;
      mockSockJS.mockImplementation(() => {
        throw new Error('WebSocket error');
      });
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        const statusMessage = screen.getByText(/WebSocket connection unavailable/);
        expect(statusMessage).toBeInTheDocument();
        expect(statusMessage).toHaveStyle({ color: 'orange' });
      });
      
      consoleSpy.mockRestore();
    });

    test('status message has proper styling', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const mockSockJS = require('sockjs-client').default;
      mockSockJS.mockImplementation(() => {
        throw new Error('WebSocket error');
      });
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        const statusMessage = screen.getByText(/WebSocket connection unavailable/);
        expect(statusMessage).toHaveStyle({ 
          color: 'orange', 
          fontSize: '0.9em', 
          marginBottom: '10px' 
        });
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    test('handles WebSocket initialization errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const mockSockJS = require('sockjs-client').default;
      mockSockJS.mockImplementation(() => {
        throw new Error('WebSocket error');
      });
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize WebSocket:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    test('handles connection errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const mockStomp = require('stompjs').default;
      
      const mockStompInstance = {
        connect: jest.fn((options, successCallback, errorCallback) => {
          errorCallback(new Error('Connection failed'));
        }),
        subscribe: jest.fn(),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('WebSocket connection failed:', expect.any(Error));
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
      
      const { unmount } = render(<NotificationComponent />);
      
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
      
      const { unmount } = render(<NotificationComponent />);
      
      unmount();
      
      expect(consoleSpy).toHaveBeenCalledWith('Error disconnecting WebSocket:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    test('only disconnects if WebSocket is connected', async () => {
      const mockStomp = require('stompjs').default;
      const mockStompInstance = {
        connect: jest.fn(),
        subscribe: jest.fn(),
        disconnect: jest.fn(),
        connected: false, // Not connected
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      const { unmount } = render(<NotificationComponent />);
      
      unmount();
      
      expect(mockStompInstance.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    test('maintains notifications state correctly', async () => {
      const mockStomp = require('stompjs').default;
      
      const mockStompInstance = {
        connect: jest.fn((options, successCallback) => {
          successCallback();
        }),
        subscribe: jest.fn((topic, callback) => {
          // Simulate receiving notifications over time
          setTimeout(() => {
            callback({
              body: JSON.stringify({
                userId: 1,
                message: 'First notification',
                date: new Date().toISOString(),
              }),
            });
          }, 100);
          
          setTimeout(() => {
            callback({
              body: JSON.stringify({
                userId: 2,
                message: 'Second notification',
                date: new Date().toISOString(),
              }),
            });
          }, 200);
        }),
        disconnect: jest.fn(),
        connected: false,
      };
      
      mockStomp.over.mockReturnValue(mockStompInstance);
      
      render(<NotificationComponent />);
      
      await waitFor(() => {
        expect(screen.getByText('First notification')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      await waitFor(() => {
        expect(screen.getByText('Second notification')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });
  });
});
