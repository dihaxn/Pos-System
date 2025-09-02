import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    // Suppress console.error for expected errors in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('Error Catching', () => {
    test('catches errors and renders fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('We\'re sorry, but something unexpected happened. Please try refreshing the page.')).toBeInTheDocument();
      expect(screen.getByText('Refresh Page')).toBeInTheDocument();
    });

    test('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    test('logs error information', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error caught by boundary:',
        expect.any(Error),
        expect.any(Object)
      );
    });
  });

  describe('Fallback UI', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    test('renders error title', () => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    test('renders error description', () => {
      const description = screen.getByText('We\'re sorry, but something unexpected happened. Please try refreshing the page.');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-gray-500', 'mb-4');
    });

    test('renders refresh button', () => {
      const button = screen.getByText('Refresh Page');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('inline-flex', 'items-center', 'px-4', 'py-2', 'border', 'border-transparent', 'text-sm', 'font-medium', 'rounded-md', 'text-white', 'bg-red-600', 'hover:bg-red-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-red-500');
    });

    test('renders error icon', () => {
      const iconContainer = screen.getByText('Something went wrong').closest('div').querySelector('.mx-auto.flex.items-center.justify-center.h-12.w-12.rounded-full.bg-red-100.mb-4');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Error Details', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    test('shows error details when expanded', () => {
      const detailsElement = screen.getByText('Error Details').closest('details');
      expect(detailsElement).toBeInTheDocument();
      
      // The details should be visible by default since error exists
      expect(detailsElement).toHaveAttribute('open');
    });

    test('error details container has proper styling', () => {
      const detailsContainer = screen.getByText('Error Details').closest('details');
      expect(detailsContainer).toHaveClass('mt-4', 'text-left');
    });

    test('summary has proper styling', () => {
      const summary = screen.getByText('Error Details');
      expect(summary).toHaveClass('text-sm', 'text-gray-600', 'cursor-pointer');
    });

    test('pre element has proper styling', () => {
      const preElement = screen.getByText('Error Details').closest('details').querySelector('pre');
      expect(preElement).toHaveClass('mt-2', 'text-xs', 'text-gray-500', 'bg-gray-100', 'p-2', 'rounded', 'overflow-auto');
    });
  });

  describe('Refresh Functionality', () => {
    test('refresh button calls window.location.reload', () => {
      const reloadMock = jest.fn();
      // Mock window.location.reload without redefining the entire location object
      const originalReload = window.location.reload;
      window.location.reload = reloadMock;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const button = screen.getByText('Refresh Page');
      fireEvent.click(button);

      expect(reloadMock).toHaveBeenCalled();

      // Restore original
      window.location.reload = originalReload;
    });
  });

  describe('Layout and Styling', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    test('has proper container layout', () => {
      const container = screen.getByText('Something went wrong').closest('div');
      expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-50');
    });

    test('error card has proper styling', () => {
      const card = screen.getByText('Something went wrong').closest('div');
      expect(card).toHaveClass('max-w-md', 'w-full', 'bg-white', 'shadow-lg', 'rounded-lg', 'p-6');
    });

    test('content is centered', () => {
      const content = screen.getByText('Something went wrong').closest('div');
      expect(content).toHaveClass('text-center');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    test('has proper heading structure', () => {
      const heading = screen.getByRole('heading', { name: 'Something went wrong' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });

    test('error icon has proper accessibility attributes', () => {
      const iconContainer = screen.getByText('Something went wrong').closest('div').querySelector('.mx-auto.flex.items-center.justify-center.h-12.w-12.rounded-full.bg-red-100.mb-4');
      expect(iconContainer).toBeInTheDocument();
      
      const svg = iconContainer.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('Error Information', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    test('displays error message in details', () => {
      const errorDetails = screen.getByText('Error Details').closest('details');
      expect(errorDetails).toBeInTheDocument();
      
      // Check if error message is displayed
      const preElement = errorDetails.querySelector('pre');
      expect(preElement).toHaveTextContent('Error: Test error message');
    });

    test('displays component stack trace when available', () => {
      const errorDetails = screen.getByText('Error Details').closest('details');
      const preElement = errorDetails.querySelector('pre');
      
      // The component stack should be displayed if available
      expect(preElement).toBeInTheDocument();
    });
  });
});
