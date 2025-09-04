import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Polyfill for Node.js global object
    global: 'globalThis',
    // Polyfill for process object
    'process.env': {},
    // Additional polyfills
    'process.browser': true,
    'process.version': '"v16.0.0"',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Development server optimization
  server: {
    hmr: true,
    // Enable hot module replacement
    watch: {
      usePolling: true,
    },
  },
  // CSS optimization
  css: {
    devSourcemap: true,
  },
  // Bundle analysis mode
  ...(mode === 'analyze' && {
    plugins: [
      react(),
      // Add bundle analyzer plugin here if needed
    ],
  }),
}))
