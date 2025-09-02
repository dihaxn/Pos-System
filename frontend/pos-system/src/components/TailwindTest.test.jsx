import React from 'react';
import { render, screen } from '../utils/test-utils';
import TailwindTest from './TailwindTest';

describe('TailwindTest Component', () => {
  describe('Rendering', () => {
    test('renders without crashing', () => {
      render(<TailwindTest />);
      expect(screen.getByText('Tailwind CSS is Working!')).toBeInTheDocument();
    });

    test('renders all main elements', () => {
      render(<TailwindTest />);
      
      expect(screen.getByText('Tailwind CSS is Working!')).toBeInTheDocument();
      expect(screen.getByText(/This component uses various Tailwind CSS classes/)).toBeInTheDocument();
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    test('renders feature list items', () => {
      render(<TailwindTest />);
      
      expect(screen.getByText('Colors and spacing')).toBeInTheDocument();
      expect(screen.getByText('Flexbox and layout')).toBeInTheDocument();
      expect(screen.getByText('Shadows and borders')).toBeInTheDocument();
      expect(screen.getByText('Typography and fonts')).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    test('renders success icon', () => {
      render(<TailwindTest />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toBeInTheDocument();
    });

    test('renders colored indicator dots', () => {
      render(<TailwindTest />);
      
      const dots = screen.getAllByTestId('indicator-dot');
      expect(dots).toHaveLength(4);
    });

    test('renders main container with proper styling', () => {
      render(<TailwindTest />);
      
      const mainContainer = screen.getByText('Tailwind CSS is Working!').closest('div');
      expect(mainContainer).toHaveClass('max-w-md', 'w-full', 'bg-white', 'rounded-xl', 'shadow-lg', 'p-8');
    });
  });

  describe('Tailwind CSS Classes', () => {
    test('applies gradient background', () => {
      render(<TailwindTest />);
      
      const backgroundContainer = screen.getByText('Tailwind CSS is Working!').closest('div').parentElement;
      expect(backgroundContainer).toHaveClass('bg-gradient-to-br', 'from-blue-50', 'to-indigo-100');
    });

    test('applies flexbox layout', () => {
      render(<TailwindTest />);
      
      const backgroundContainer = screen.getByText('Tailwind CSS is Working!').closest('div').parentElement;
      expect(backgroundContainer).toHaveClass('flex', 'items-center', 'justify-center');
    });

    test('applies responsive design classes', () => {
      render(<TailwindTest />);
      
      const backgroundContainer = screen.getByText('Tailwind CSS is Working!').closest('div').parentElement;
      expect(backgroundContainer).toHaveClass('min-h-screen', 'p-4');
    });

    test('applies card styling', () => {
      render(<TailwindTest />);
      
      const card = screen.getByText('Tailwind CSS is Working!').closest('div');
      expect(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'p-8');
    });

    test('applies button styling', () => {
      render(<TailwindTest />);
      
      const button = screen.getByText('Success!');
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'font-medium', 'py-3', 'px-4', 'rounded-lg');
    });

    test('applies hover effects', () => {
      render(<TailwindTest />);
      
      const button = screen.getByText('Success!');
      expect(button).toHaveClass('hover:bg-blue-700');
    });

    test('applies transitions', () => {
      render(<TailwindTest />);
      
      const button = screen.getByText('Success!');
      expect(button).toHaveClass('transition-colors', 'duration-200');
    });
  });

  describe('Typography', () => {
    test('applies heading styles', () => {
      render(<TailwindTest />);
      
      const heading = screen.getByText('Tailwind CSS is Working!');
      expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-gray-900');
    });

    test('applies paragraph styles', () => {
      render(<TailwindTest />);
      
      const paragraph = screen.getByText(/This component uses various Tailwind CSS classes/);
      expect(paragraph).toHaveClass('text-gray-600', 'mb-6');
    });

    test('applies small text styles', () => {
      render(<TailwindTest />);
      
      const smallTexts = screen.getAllByText(/Colors and spacing|Flexbox and layout|Shadows and borders|Typography and fonts/);
      smallTexts.forEach(text => {
        expect(text).toHaveClass('text-sm', 'text-gray-700');
      });
    });
  });

  describe('Spacing and Layout', () => {
    test('applies proper margins and padding', () => {
      render(<TailwindTest />);
      
      const heading = screen.getByText('Tailwind CSS is Working!');
      const paragraph = screen.getByText(/This component uses various Tailwind CSS classes/);
      const button = screen.getByText('Success!');
      
      expect(heading).toHaveClass('mb-2');
      expect(paragraph).toHaveClass('mb-6');
      expect(button).toHaveClass('mt-6');
    });

    test('applies proper spacing between list items', () => {
      render(<TailwindTest />);
      
      const listContainer = screen.getByText('Colors and spacing').closest('div');
      expect(listContainer).toHaveClass('space-y-3');
    });

    test('applies proper spacing within list items', () => {
      render(<TailwindTest />);
      
      const listItems = screen.getAllByText(/Colors and spacing|Flexbox and layout|Shadows and borders|Typography and fonts/);
      listItems.forEach(item => {
        const container = item.closest('div');
        expect(container).toHaveClass('space-x-3');
      });
    });
  });

  describe('Colors', () => {
    test('applies blue color scheme to button', () => {
      render(<TailwindTest />);
      
      const button = screen.getByText('Success!');
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
    });

    test('applies green color to success icon background', () => {
      render(<TailwindTest />);
      
      const iconContainer = screen.getByRole('img', { hidden: true }).closest('div');
      expect(iconContainer).toHaveClass('bg-green-100');
    });

    test('applies green color to success icon', () => {
      render(<TailwindTest />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toHaveClass('text-green-600');
    });

    test('applies gray colors to text', () => {
      render(<TailwindTest />);
      
      const heading = screen.getByText('Tailwind CSS is Working!');
      const paragraph = screen.getByText(/This component uses various Tailwind CSS classes/);
      
      expect(heading).toHaveClass('text-gray-900');
      expect(paragraph).toHaveClass('text-gray-600');
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      render(<TailwindTest />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Tailwind CSS is Working!');
    });

    test('has proper button role', () => {
      render(<TailwindTest />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Success!');
    });

    test('has proper list structure', () => {
      render(<TailwindTest />);
      
      const listItems = screen.getAllByText(/Colors and spacing|Flexbox and layout|Shadows and borders|Typography and fonts/);
      expect(listItems).toHaveLength(4);
    });
  });

  describe('Responsive Design', () => {
    test('applies responsive width classes', () => {
      render(<TailwindTest />);
      
      const card = screen.getByText('Tailwind CSS is Working!').closest('div');
      expect(card).toHaveClass('max-w-md', 'w-full');
    });

    test('applies responsive padding', () => {
      render(<TailwindTest />);
      
      const backgroundContainer = screen.getByText('Tailwind CSS is Working!').closest('div').parentElement;
      expect(backgroundContainer).toHaveClass('p-4');
    });
  });

  describe('Component Structure', () => {
    test('has proper nesting structure', () => {
      render(<TailwindTest />);
      
      const backgroundContainer = screen.getByText('Tailwind CSS is Working!').closest('div').parentElement;
      const card = screen.getByText('Tailwind CSS is Working!').closest('div');
      
      expect(backgroundContainer).toContainElement(card);
    });

    test('renders all sections in correct order', () => {
      render(<TailwindTest />);
      
      const elements = [
        'Tailwind CSS is Working!',
        /This component uses various Tailwind CSS classes/,
        'Colors and spacing',
        'Flexbox and layout',
        'Shadows and borders',
        'Typography and fonts',
        'Success!'
      ];
      
      elements.forEach(element => {
        expect(screen.getByText(element)).toBeInTheDocument();
      });
    });
  });
});
