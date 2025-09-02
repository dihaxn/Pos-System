import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'owner'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRoleRedirectPath(user.role);
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  const getRoleRedirectPath = (role) => {
    switch (role) {
      case 'owner':
        return '/owner';
      case 'factory_staff':
        return '/factory-staff';
      case 'outlet_staff':
        return '/outlet';
      default:
        return '/dashboard';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role,
      username: '', // Clear username when role changes
      password: ''  // Clear password when role changes
    }));
  };

  const getRoleCredentials = (role) => {
    const credentials = {
      owner: { username: 'owner', password: 'owner123' },
      factory_staff: { username: 'factory', password: 'factory123' },
      outlet_staff: { username: 'outlet1', password: 'outlet123' }
    };
    return credentials[role] || { username: '', password: '' };
  };

  const fillDemoCredentials = () => {
    const credentials = getRoleCredentials(formData.role);
    setFormData(prev => ({
      ...prev,
      username: credentials.username,
      password: credentials.password
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter both username and password',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome, ${result.user.name}!`,
          confirmButtonColor: '#10B981',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate(result.redirectPath);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: result.error,
          confirmButtonColor: '#EF4444'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: 'An unexpected error occurred. Please try again.',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleInfo = {
    owner: {
      title: 'Owner',
      description: 'Full system access with multi-outlet analytics',
      features: ['System Overview', 'All Outlets', 'Sales Analytics', 'User Management'],
      color: 'from-purple-600 to-purple-800'
    },
    factory_staff: {
      title: 'Factory Staff',
      description: 'Production and supply chain management',
      features: ['Production Dashboard', 'Quality Control', 'Inventory Management', 'Order Processing'],
      color: 'from-blue-600 to-blue-800'
    },
    outlet_staff: {
      title: 'Outlet Staff',
      description: 'Outlet-specific sales and operations',
      features: ['Sales Dashboard', 'Customer Orders', 'Inventory Tracking', 'Daily Reports'],
      color: 'from-green-600 to-green-800'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Side - Role Selection */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">LLOMS POS System</h1>
            <p className="text-gray-300 text-lg">Select your role to continue</p>
          </div>

          <div className="space-y-4">
            {Object.entries(roleInfo).map(([role, info]) => (
              <motion.div
                key={role}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  formData.role === role
                    ? 'bg-white shadow-2xl'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
                }`}
                onClick={() => handleRoleChange(role)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.role === role
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-white/50'
                  }`}>
                    {formData.role === role && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold ${
                      formData.role === role ? 'text-gray-900' : 'text-white'
                    }`}>
                      {info.title}
                    </h3>
                    <p className={`text-sm ${
                      formData.role === role ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      {info.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {info.features.map((feature, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs ${
                            formData.role === role
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-white/20 text-white/80'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {roleInfo[formData.role].title} Login
            </h2>
            <p className="text-gray-600">
              {roleInfo[formData.role].description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
            >
              Fill Demo Credentials
            </button>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Demo Credentials:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Owner:</strong> owner / owner123</p>
              <p><strong>Factory Staff:</strong> factory / factory123</p>
              <p><strong>Outlet Staff:</strong> outlet1 / outlet123</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
