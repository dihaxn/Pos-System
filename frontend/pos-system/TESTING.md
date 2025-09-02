# Testing Documentation for LLOMS Frontend

## Overview

This project includes a comprehensive testing suite built with Jest, React Testing Library, and custom testing utilities. The testing infrastructure covers all major components, user interactions, error handling, and integration scenarios.

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **Jest DOM**: Custom DOM matchers for Jest
- **Custom Test Utils**: Shared testing functions and mock data

## Test Structure

```
src/
├── __tests__/
│   └── index.test.js              # Main test suite entry point
├── components/
│   ├── TailwindTest.test.jsx      # Tailwind CSS component tests
│   └── ErrorBoundary.test.jsx     # Error boundary tests
├── features/
│   └── shared/
│       └── components/
│           ├── DevNavigation.test.jsx      # Navigation component tests
│           ├── Layout.test.jsx             # Layout component tests
│           └── NotificationComponent.test.jsx # Notification tests
├── utils/
│   └── test-utils.jsx             # Shared testing utilities
└── setupTests.js                   # Jest setup and global mocks
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Scripts

- `npm test`: Run all tests once
- `npm run test:watch`: Run tests in watch mode for development
- `npm run test:coverage`: Generate coverage report
- `npm run test:ci`: Run tests optimized for CI/CD pipelines

## Test Coverage

### 1. App Component (`App.test.jsx`)

- **Routing**: Tests all route configurations and redirects
- **Component Rendering**: Verifies lazy-loaded components load correctly
- **Development Features**: Tests dev navigation and performance monitor
- **Error Handling**: Tests error boundaries and fallback UI
- **Loading States**: Verifies loading spinners and suspense boundaries

### 2. DevNavigation Component (`DevNavigation.test.jsx`)

- **Navigation Functionality**: Tests all navigation buttons and routes
- **Environment Conditions**: Verifies development-only rendering
- **Button Interactions**: Tests click handlers and navigation calls
- **Styling**: Verifies Tailwind CSS classes and responsive design
- **Accessibility**: Tests proper ARIA roles and semantic structure

### 3. Layout Component (`Layout.test.jsx`)

- **Sidebar Functionality**: Tests sidebar toggle and responsive behavior
- **WebSocket Integration**: Tests SockJS and Stomp connection handling
- **Layout Structure**: Verifies flexbox layout and CSS classes
- **Error Handling**: Tests WebSocket connection failures gracefully
- **Cleanup**: Verifies proper WebSocket disconnection on unmount

### 4. NotificationComponent (`NotificationComponent.test.jsx`)

- **WebSocket Connection**: Tests connection establishment and error handling
- **Notification Handling**: Tests receiving and parsing notifications
- **State Management**: Verifies notification list updates
- **Error Scenarios**: Tests malformed data and connection failures
- **UI Updates**: Verifies real-time notification display

### 5. TailwindTest Component (`TailwindTest.test.jsx`)

- **Tailwind CSS**: Tests all Tailwind utility classes
- **Component Rendering**: Verifies component structure and content
- **Styling**: Tests colors, spacing, typography, and responsive design
- **Interactions**: Tests hover effects and transitions
- **Accessibility**: Verifies proper heading structure and button roles

### 6. ErrorBoundary Component (`ErrorBoundary.test.jsx`)

- **Error Catching**: Tests error boundary functionality
- **Fallback UI**: Verifies error display and user guidance
- **Error Details**: Tests expandable error information
- **Refresh Functionality**: Tests page reload capability
- **State Management**: Verifies error state persistence

## Testing Utilities

### Custom Render Function

The `test-utils.jsx` file provides a custom render function that includes:

- Browser Router for routing tests
- Material-UI Theme Provider
- Custom mock data and functions

### Mock Data

```javascript
import {
  mockUser,
  mockNotification,
  mockOrder,
  mockProduct,
} from "../utils/test-utils";

// Use in tests
test("displays user information", () => {
  render(<UserProfile user={mockUser} />);
  expect(screen.getByText(mockUser.username)).toBeInTheDocument();
});
```

### Mock Functions

```javascript
import { mockNavigate, mockLocation } from "../utils/test-utils";

// Mock React Router hooks
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));
```

## Mocking Strategy

### WebSocket Mocks

```javascript
jest.mock("sockjs-client", () => ({
  default: jest.fn(() => ({
    close: jest.fn(),
  })),
}));

jest.mock("stompjs", () => ({
  default: {
    over: jest.fn(() => ({
      connect: jest.fn(),
      subscribe: jest.fn(),
      disconnect: jest.fn(),
      connected: false,
    })),
  },
}));
```

### API Mocks

```javascript
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));
```

## Coverage Requirements

The project maintains a minimum test coverage of:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Best Practices

### 1. Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Test both success and failure scenarios

### 2. Component Testing

- Test user interactions (clicks, form submissions)
- Verify proper rendering of props and state
- Test error boundaries and loading states

### 3. Mock Management

- Clear mocks between tests using `beforeEach`
- Use realistic mock data that matches API responses
- Mock external dependencies consistently

### 4. Accessibility Testing

- Test proper ARIA roles and labels
- Verify keyboard navigation
- Test screen reader compatibility

## Debugging Tests

### Common Issues

1. **Async Tests**: Use `waitFor` for asynchronous operations
2. **Mock Dependencies**: Ensure all external libraries are properly mocked
3. **Component State**: Test both initial and updated states
4. **Error Boundaries**: Test error scenarios without breaking the test runner

### Debug Commands

```bash
# Run specific test file
npm test -- --testPathPattern=App.test.jsx

# Run tests with verbose output
npm test -- --verbose

# Run tests matching a pattern
npm test -- --testNamePattern="renders without crashing"
```

## CI/CD Integration

The test suite is configured for continuous integration:

```bash
npm run test:ci
```

This command:

- Runs tests in CI mode
- Generates coverage reports
- Exits with proper error codes
- Optimized for automated environments

## Performance Testing

While not included in the current test suite, consider adding:

- Component render performance tests
- Bundle size monitoring
- Memory leak detection
- WebSocket connection stability tests

## Future Enhancements

1. **E2E Testing**: Add Cypress or Playwright for full application testing
2. **Visual Regression**: Implement visual testing for UI consistency
3. **Performance Testing**: Add performance benchmarks and monitoring
4. **Accessibility Testing**: Integrate axe-core for automated accessibility testing

## Contributing to Tests

When adding new components or features:

1. Create corresponding test files
2. Follow the existing testing patterns
3. Ensure adequate coverage for new functionality
4. Update this documentation as needed
5. Run the full test suite before submitting changes

## Support

For testing-related issues:

1. Check the Jest documentation
2. Review React Testing Library best practices
3. Examine existing test patterns in the codebase
4. Consult the testing utilities in `test-utils.jsx`
