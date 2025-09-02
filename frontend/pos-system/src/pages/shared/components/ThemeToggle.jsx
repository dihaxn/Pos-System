import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const ThemeToggle = ({ className = '' }) => {
  const { theme, isSystemTheme, toggleTheme, setSystemTheme } = useTheme();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* System Theme Button */}
      <button
        onClick={setSystemTheme}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isSystemTheme
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        title="Use system theme"
      >
        <ComputerDesktopIcon className="w-5 h-5" />
      </button>

      {/* Light Theme Button */}
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-all duration-200 ${
          theme === 'light' && !isSystemTheme
            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        title="Light theme"
      >
        <SunIcon className="w-5 h-5" />
      </button>

      {/* Dark Theme Button */}
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-all duration-200 ${
          theme === 'dark' && !isSystemTheme
            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        title="Dark theme"
      >
        <MoonIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ThemeToggle;
