import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/App.css";

// Import enhanced components
import ErrorBoundary from "./components/shared/ErrorBoundary/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages for better performance
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));
const OutletPage = lazy(() => import("./pages/outlet/pages/OutletPage"));
const FactoryStaffPage = lazy(() => import("./pages/factory/pages/FactoryStaffPage"));
const OwnerPage = lazy(() => import("./pages/owner/pages/OwnerPage"));

// Tailwind test component
const TailwindTest = lazy(() => import("./components/TailwindTest"));

// Enhanced Loading component with skeleton
const PageLoader = () => (
  <motion.div 
    className="flex items-center justify-center min-h-screen bg-gray-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-center">
      <motion.div
        className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  </motion.div>
);

// Enhanced Error component for route errors
const RouteError = ({ error }) => (
  <motion.div 
    className="flex items-center justify-center min-h-screen bg-gray-50"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center max-w-md mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <motion.div
          className="text-red-500 mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Route Error</h2>
        <p className="text-gray-600 mb-6">Something went wrong while loading this page.</p>
        
        <div className="space-y-3">
          <motion.button 
            onClick={() => window.location.reload()} 
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reload Page
          </motion.button>
          
          <motion.button 
            onClick={() => window.history.back()} 
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Go Back
          </motion.button>
        </div>
        
        {error && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-gray-600 cursor-pointer mb-2">
              Error Details
            </summary>
            <div className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              <pre className="whitespace-pre-wrap text-gray-700">
                {error.toString()}
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  </motion.div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Role-specific protected routes */}
                <Route 
                  path="/owner" 
                  element={
                    <ProtectedRoute requiredRole="owner">
                      <OwnerPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/factory-staff" 
                  element={
                    <ProtectedRoute requiredRole="factory_staff">
                      <FactoryStaffPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/outlet" 
                  element={
                    <ProtectedRoute requiredRole="outlet_staff">
                      <OutletPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Development routes */}
                <Route 
                  path="/tailwind-test" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <TailwindTest />
                    </Suspense>
                  } 
                />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
