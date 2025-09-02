import './polyfills.js'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
// import { AuthProvider } from './features/auth/context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    {/* <AuthProvider> */}
      <App />
    {/* </AuthProvider> */}
  </ErrorBoundary>
)
