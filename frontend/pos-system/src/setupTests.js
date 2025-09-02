import '@testing-library/jest-dom';

// Mock import.meta.env for Vite
global.import = global.import || {};
global.import.meta = global.import.meta || {};
global.import.meta.env = global.import.meta.env || {
  DEV: true,
  PROD: false,
  MODE: 'development'
};

// Polyfill for TextEncoder/TextDecoder (needed by react-router)
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock window.scroll
Object.defineProperty(window, 'scroll', {
  writable: true,
  value: jest.fn(),
});

// Mock window.scrollBy
Object.defineProperty(window, 'scrollBy', {
  writable: true,
  value: jest.fn(),
});

// Mock window.scrollIntoView
Object.defineProperty(window, 'scrollIntoView', {
  writable: true,
  value: jest.fn(),
});

// Mock window.scrollX and scrollY
Object.defineProperty(window, 'scrollX', {
  writable: true,
  value: 0,
});

Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
});

// Mock window.innerHeight and innerWidth
Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 768,
});

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024,
});

// Mock window.outerHeight and outerWidth
Object.defineProperty(window, 'outerHeight', {
  writable: true,
  value: 768,
});

Object.defineProperty(window, 'outerWidth', {
  writable: true,
  value: 1024,
});

// Mock window.pageXOffset and pageYOffset
Object.defineProperty(window, 'pageXOffset', {
  writable: true,
  value: 0,
});

Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  value: 0,
});

// Mock window.screen
Object.defineProperty(window, 'screen', {
  writable: true,
  value: {
    width: 1024,
    height: 768,
    availWidth: 1024,
    availHeight: 768,
  },
});

// Mock window.localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: localStorageMock,
});

// Mock window.sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  writable: true,
  value: sessionStorageMock,
});

// Mock window.fetch
Object.defineProperty(window, 'fetch', {
  writable: true,
  value: jest.fn(),
});

// Mock window.XMLHttpRequest
Object.defineProperty(window, 'XMLHttpRequest', {
  writable: true,
  value: jest.fn(),
});

// Mock window.WebSocket
Object.defineProperty(window, 'WebSocket', {
  writable: true,
  value: jest.fn(),
});

// Mock window.EventSource
Object.defineProperty(window, 'EventSource', {
  writable: true,
  value: jest.fn(),
});

// Mock window.URL
Object.defineProperty(window, 'URL', {
  writable: true,
  value: jest.fn(),
});

// Mock window.URLSearchParams
Object.defineProperty(window, 'URLSearchParams', {
  writable: true,
  value: jest.fn(),
});

// Mock window.FormData
Object.defineProperty(window, 'FormData', {
  writable: true,
  value: jest.fn(),
});

// Mock window.FileReader
Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: jest.fn(),
});

// Mock window.Blob
Object.defineProperty(window, 'Blob', {
  writable: true,
  value: jest.fn(),
});

// Mock window.File
Object.defineProperty(window, 'File', {
  writable: true,
  value: jest.fn(),
});

// Mock window.Image
Object.defineProperty(window, 'Image', {
  writable: true,
  value: jest.fn(),
});

// Mock window.Audio
Object.defineProperty(window, 'Audio', {
  writable: true,
  value: jest.fn(),
});

// Mock window.Video
Object.defineProperty(window, 'Video', {
  writable: true,
  value: jest.fn(),
});

// Mock window.Canvas
Object.defineProperty(window, 'Canvas', {
  writable: true,
  value: jest.fn(),
});

// Mock window.CanvasRenderingContext2D
Object.defineProperty(window, 'CanvasRenderingContext2D', {
  writable: true,
  value: jest.fn(),
});

// Mock window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: jest.fn(() => ({
    getPropertyValue: jest.fn(),
  })),
});

// Mock window.getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
}));

// Mock window.requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: jest.fn((cb) => setTimeout(cb, 0)),
});

// Mock window.cancelAnimationFrame
Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: jest.fn(),
});

// Mock window.requestIdleCallback
Object.defineProperty(window, 'requestIdleCallback', {
  writable: true,
  value: jest.fn((cb) => setTimeout(cb, 0)),
});

// Mock window.cancelIdleCallback
Object.defineProperty(window, 'cancelIdleCallback', {
  writable: true,
  value: jest.fn(),
});

// Mock window.setTimeout
Object.defineProperty(window, 'setTimeout', {
  writable: true,
  value: jest.fn(),
});

// Mock window.clearTimeout
Object.defineProperty(window, 'clearTimeout', {
  writable: true,
  value: jest.fn(),
});

// Mock window.setInterval
Object.defineProperty(window, 'setInterval', {
  writable: true,
  value: jest.fn(),
});

// Mock window.clearInterval
Object.defineProperty(window, 'clearInterval', {
  writable: true,
  value: jest.fn(),
});

// Mock window.console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Suppress specific warnings that are not relevant to tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: useLayoutEffect does nothing on the server') ||
     args[0].includes('Warning: An invalid form control with name') ||
     args[0].includes('Warning: validateDOMNesting') ||
     args[0].includes('Warning: Each child in a list should have a unique "key" prop'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  // Suppress specific warnings that are not relevant to tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: useLayoutEffect does nothing on the server') ||
     args[0].includes('Warning: An invalid form control with name') ||
     args[0].includes('Warning: validateDOMNesting') ||
     args[0].includes('Warning: Each child in a list should have a unique "key" prop'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};
