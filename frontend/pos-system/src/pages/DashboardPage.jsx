import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import NavigationMenu from '../components/NavigationMenu';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call based on user role
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let data = {};
      if (user.role === 'owner') {
        data = {
          totalSales: 50000.75,
          totalOrders: 1800,
          totalCustomers: 1200,
          salesGrowth: 15.2,
          outlets: [
            { id: 1, name: 'Main Outlet', sales: 35000, growth: 18.5 },
            { id: 2, name: 'Branch Outlet', sales: 15000, growth: 8.2 }
          ]
        };
      } else if (user.role === 'factory_staff') {
        data = {
          totalProduction: 1000,
          pendingOrders: 25,
          completedOrders: 150,
          defectRate: 0.5,
          efficiency: 92.3
        };
      } else if (user.role === 'outlet_staff') {
        data = {
          todaySales: 1250.50,
          todayOrders: 45,
          todayCustomers: 38,
          averageOrderValue: 27.79,
          lowStockItems: 3,
          outOfStockItems: 1
        };
      }
      
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'owner': return 'from-purple-600 to-purple-800';
      case 'factory_staff': return 'from-blue-600 to-blue-800';
      case 'outlet_staff': return 'from-green-600 to-green-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'owner': return '👑';
      case 'factory_staff': return '🏭';
      case 'outlet_staff': return '🏪';
      default: return '👤';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">LLOMS POS System</h1>
              <div className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getRoleColor()}`}>
                {getRoleIcon()} {user.role.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                {user.outletName && (
                  <p className="text-xs text-gray-500">{user.outletName}</p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome back, {user.name.split(' ')[0]}!
          </h2>

          {/* Navigation Menu */}
          <NavigationMenu />

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {user.role === 'owner' && dashboardData && (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sales</p>
                      <p className="text-3xl font-bold text-gray-900">Rs{dashboardData.totalSales.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-green-600 text-sm font-medium">+{dashboardData.salesGrowth}%</span>
                    <span className="text-gray-500 text-sm ml-2">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.totalCustomers.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {user.role === 'factory_staff' && dashboardData && (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Production</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.totalProduction.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏭</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.pendingOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⏳</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Efficiency</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.efficiency}%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {user.role === 'outlet_staff' && dashboardData && (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                      <p className="text-3xl font-bold text-gray-900">Rs{dashboardData.todaySales.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.todayOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.lowStockItems}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {user.role === 'owner' && (
                <>
                  <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">📊</span>
                    <p className="font-medium text-gray-900">View Reports</p>
                    <p className="text-sm text-gray-600">System analytics</p>
                  </button>
                  <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">👥</span>
                    <p className="font-medium text-gray-900">Manage Users</p>
                    <p className="text-sm text-gray-600">User management</p>
                  </button>
                  <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">🏪</span>
                    <p className="font-medium text-gray-900">Manage Outlets</p>
                    <p className="text-sm text-gray-600">Outlet settings</p>
                  </button>
                  <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">📈</span>
                    <p className="font-medium text-gray-900">Analytics</p>
                    <p className="text-sm text-gray-600">Business insights</p>
                  </button>
                </>
              )}

              {user.role === 'factory_staff' && (
                <>
                  <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">🏭</span>
                    <p className="font-medium text-gray-900">Production</p>
                    <p className="text-sm text-gray-600">Manage production</p>
                  </button>
                  <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">📦</span>
                    <p className="font-medium text-gray-900">Orders</p>
                    <p className="text-sm text-gray-600">Process orders</p>
                  </button>
                  <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">📊</span>
                    <p className="font-medium text-gray-900">Quality Control</p>
                    <p className="text-sm text-gray-600">Quality metrics</p>
                  </button>
                  <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">📋</span>
                    <p className="font-medium text-gray-900">Inventory</p>
                    <p className="text-sm text-gray-600">Stock management</p>
                  </button>
                </>
              )}

              {user.role === 'outlet_staff' && (
                <>
                  <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">🛒</span>
                    <p className="font-medium text-gray-900">New Sale</p>
                    <p className="text-sm text-gray-600">Process sale</p>
                  </button>
                  <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">📦</span>
                    <p className="font-medium text-gray-900">Orders</p>
                    <p className="text-sm text-gray-600">View orders</p>
                  </button>
                  <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">📊</span>
                    <p className="font-medium text-gray-900">Reports</p>
                    <p className="text-sm text-gray-600">Daily reports</p>
                  </button>
                  <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200 text-left">
                    <span className="text-2xl mb-2 block">📋</span>
                    <p className="font-medium text-gray-900">Inventory</p>
                    <p className="text-sm text-gray-600">Stock levels</p>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
