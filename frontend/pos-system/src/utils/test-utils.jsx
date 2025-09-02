import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

// Create a basic theme for Material-UI components
const theme = createTheme();

// Custom render function that includes providers
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock data for testing
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'owner',
  outletId: 1,
};

export const mockNotification = {
  id: 1,
  message: 'Test notification',
  userId: 1,
  date: new Date().toISOString(),
  type: 'info',
};

export const mockOrder = {
  id: 1,
  customerName: 'John Doe',
  items: [
    { id: 1, name: 'Product 1', quantity: 2, price: 10.99 },
    { id: 2, name: 'Product 2', quantity: 1, price: 15.99 },
  ],
  total: 37.97,
  status: 'pending',
  createdAt: new Date().toISOString(),
};

export const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'A test product for testing',
  price: 19.99,
  category: 'test',
  stock: 100,
  image: 'test-image.jpg',
};

// Mock functions
export const mockNavigate = jest.fn();
export const mockLocation = {
  pathname: '/test',
  search: '',
  hash: '',
  state: null,
};

// Mock SockJS and Stomp
export const mockSockJS = {
  new: jest.fn(() => ({
    close: jest.fn(),
  })),
};

export const mockStomp = {
  over: jest.fn(() => ({
    connect: jest.fn(),
    subscribe: jest.fn(),
    disconnect: jest.fn(),
    connected: false,
  })),
};

// Mock axios
export const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => mockAxios),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};
