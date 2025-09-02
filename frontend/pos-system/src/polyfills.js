// Polyfills for Node.js globals that are expected by some libraries
if (typeof global === 'undefined') {
  window.global = window;
}

if (typeof process === 'undefined') {
  window.process = {
    env: {},
    browser: true,
    version: '',
    nextTick: (fn) => Promise.resolve().then(fn)
  };
}

// Polyfill for Buffer if needed
if (typeof Buffer === 'undefined') {
  window.Buffer = {
    isBuffer: () => false
  };
}

// Polyfill for setImmediate if needed
if (typeof setImmediate === 'undefined') {
  window.setImmediate = (fn) => setTimeout(fn, 0);
}

// Polyfill for clearImmediate if needed
if (typeof clearImmediate === 'undefined') {
  window.clearImmediate = (id) => clearTimeout(id);
}

// Handle ethereum property redefinition issue
// This is often caused by browser extensions or injected scripts
if (typeof window.ethereum !== 'undefined') {
  try {
    // Check if the property is already non-configurable
    const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
    if (descriptor && descriptor.configurable) {
      // Store the original ethereum object
      const originalEthereum = window.ethereum;
      
      // Define a new ethereum property that can't be redefined
      Object.defineProperty(window, 'ethereum', {
        value: originalEthereum,
        writable: false,
        configurable: false,
        enumerable: true
      });
    }
  } catch (error) {
    console.warn('Could not protect ethereum property:', error);
  }
}

// Additional polyfills for common libraries
if (typeof window.fetch === 'undefined') {
  console.warn('Fetch API not available, some features may not work');
}

// Ensure console methods exist
if (typeof console === 'undefined') {
  window.console = {
    log: () => {},
    warn: () => {},
    error: () => {},
    info: () => {}
  };
}
