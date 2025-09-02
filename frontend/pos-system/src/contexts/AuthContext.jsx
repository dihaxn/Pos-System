import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AuthContext = createContext();

// Mock user data for different roles
const mockUsers = {
  owner: {
    id: 1,
    username: 'owner',
    password: 'owner123',
    role: 'owner',
    name: 'Mr. Premasiri Wakwalla',
    email: 'owner@littlelanka.com',
    permissions: ['all']
  },
  factory_staff: {
    id: 2,
    username: 'factory',
    password: 'factory123',
    role: 'factory_staff',
    name: 'Factory Manager',
    email: 'factory@littlelanka.com',
    permissions: ['factory', 'production', 'inventory']
  },
  outlet_staff: {
    id: 3,
    username: 'outlet1',
    password: 'outlet123',
    role: 'outlet_staff',
    name: 'Outlet Staff - Main Branch',
    email: 'outlet1@littlelanka.com',
    outletId: 1,
    outletName: 'Main Outlet',
    permissions: ['outlet', 'sales', 'inventory']
  },
  outlet_staff_2: {
    id: 4,
    username: 'outlet2',
    password: 'outlet123',
    role: 'outlet_staff',
    name: 'Outlet Staff - Branch',
    email: 'outlet2@littlelanka.com',
    outletId: 2,
    outletName: 'Branch Outlet',
    permissions: ['outlet', 'sales', 'inventory']
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lloms_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('lloms_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = Object.values(mockUsers).find(
        u => u.username === username && u.password === password
      );
      
      if (foundUser) {
        const userData = { ...foundUser };
        delete userData.password; // Remove password from stored data
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('lloms_user', JSON.stringify(userData));
        
        // Determine redirect path based on role
        const redirectPath = getRoleRedirectPath(userData.role);
        
        return { success: true, user: userData, redirectPath };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

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

  const logout = async () => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Sign Out',
        text: 'Are you sure you want to sign out?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Yes, Sign Out',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        // Clear user data
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('lloms_user');
        
        // Show success message
        Swal.fire({
          title: 'Signed Out',
          text: 'You have been successfully signed out.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          timer: 2000,
          showConfirmButton: false
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('lloms_user');
      return true;
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  const canAccessOutlet = (outletId) => {
    if (!user) return false;
    if (user.role === 'owner') return true;
    if (user.role === 'outlet_staff') return user.outletId === outletId;
    return false;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasPermission,
    canAccessOutlet
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
