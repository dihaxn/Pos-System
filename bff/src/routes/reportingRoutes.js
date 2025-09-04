const express = require('express');
const router = express.Router();

// Role-based access control middleware
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // For demo purposes, we'll extract role from query parameter
    // In production, this would come from JWT token
    const userRole = req.query.role || req.headers['x-user-role'] || 'owner';
    
    if (allowedRoles.includes(userRole)) {
      req.userRole = userRole;
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
  };
};

// Mock reporting data
const mockSalesReports = [
  {
    id: 1,
    outletId: 1,
    outletName: "Main Branch",
    reportDate: "2024-01-15T00:00:00Z",
    totalSales: 1250.50,
    totalOrders: 45,
    totalItemsSold: 120,
    averageOrderValue: 27.79,
    topSellingProduct: "Traditional Curry Powder",
    topSellingCategory: "Spices",
    reportType: "DAILY"
  },
  {
    id: 2,
    outletId: 1,
    outletName: "Main Branch",
    reportDate: "2024-01-08T00:00:00Z",
    totalSales: 8750.25,
    totalOrders: 315,
    totalItemsSold: 840,
    averageOrderValue: 27.78,
    topSellingProduct: "Ceylon Tea",
    topSellingCategory: "Beverages",
    reportType: "WEEKLY"
  },
  {
    id: 3,
    outletId: 1,
    outletName: "Main Branch",
    reportDate: "2024-01-01T00:00:00Z",
    totalSales: 37500.75,
    totalOrders: 1350,
    totalItemsSold: 3600,
    averageOrderValue: 27.78,
    topSellingProduct: "Traditional Curry Powder",
    topSellingCategory: "Spices",
    reportType: "MONTHLY"
  }
];

const mockProductAnalytics = [
  {
    id: 1,
    productId: 1,
    productName: "Traditional Curry Powder",
    category: "Spices",
    outletId: 1,
    totalQuantitySold: 150,
    totalRevenue: 2398.50,
    averagePrice: 15.99,
    stockTurnoverRate: 2.5,
    analysisDate: "2024-01-15T00:00:00Z"
  },
  {
    id: 2,
    productId: 2,
    productName: "Ceylon Tea",
    category: "Beverages",
    outletId: 1,
    totalQuantitySold: 200,
    totalRevenue: 2500.00,
    averagePrice: 12.50,
    stockTurnoverRate: 3.2,
    analysisDate: "2024-01-15T00:00:00Z"
  },
  {
    id: 3,
    productId: 3,
    productName: "Coconut Oil",
    category: "Oils",
    outletId: 1,
    totalQuantitySold: 75,
    totalRevenue: 674.25,
    averagePrice: 8.99,
    stockTurnoverRate: 1.8,
    analysisDate: "2024-01-15T00:00:00Z"
  }
];

// Sales Reports
router.get('/sales/outlet/:outletId', (req, res) => {
  const { outletId } = req.params;
  const { reportType } = req.query;
  
  let reports = mockSalesReports.filter(r => r.outletId === parseInt(outletId));
  if (reportType) {
    reports = reports.filter(r => r.reportType === reportType);
  }
  
  res.json(reports);
});

router.get('/sales/date-range', (req, res) => {
  const { startDate, endDate, reportType } = req.query;
  
  let reports = mockSalesReports;
  if (reportType) {
    reports = reports.filter(r => r.reportType === reportType);
  }
  
  res.json(reports);
});

router.get('/sales/top-performers', (req, res) => {
  const { reportType, limit = 10 } = req.query;
  
  let reports = mockSalesReports;
  if (reportType) {
    reports = reports.filter(r => r.reportType === reportType);
  }
  
  reports = reports
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, parseInt(limit));
  
  res.json(reports);
});

// Product Analytics
router.get('/analytics/outlet/:outletId', (req, res) => {
  const { outletId } = req.params;
  const { startDate, endDate } = req.query;
  
  const analytics = mockProductAnalytics.filter(a => a.outletId === parseInt(outletId));
  res.json(analytics);
});

router.get('/analytics/top-selling/:outletId', (req, res) => {
  const { outletId } = req.params;
  const { limit = 10 } = req.query;
  
  const analytics = mockProductAnalytics
    .filter(a => a.outletId === parseInt(outletId))
    .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)
    .slice(0, parseInt(limit));
  
  res.json(analytics);
});

router.get('/analytics/category/:category', (req, res) => {
  const { category } = req.params;
  const { limit = 10 } = req.query;
  
  const analytics = mockProductAnalytics
    .filter(a => a.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, parseInt(limit));
  
  res.json(analytics);
});

router.get('/analytics/high-turnover/:outletId', (req, res) => {
  const { outletId } = req.params;
  const { startDate } = req.query;
  
  const analytics = mockProductAnalytics
    .filter(a => a.outletId === parseInt(outletId))
    .sort((a, b) => b.stockTurnoverRate - a.stockTurnoverRate);
  
  res.json(analytics);
});

// Dashboard and Trends
router.get('/dashboard/:outletId', (req, res) => {
  const { outletId } = req.params;
  
  const summary = {
    totalSales: 1250.50,
    totalOrders: 45,
    totalCustomers: 38,
    averageOrderValue: 27.79,
    topSellingProduct: "Traditional Curry Powder",
    salesGrowth: 12.5,
    orderGrowth: 8.3
  };
  
  res.json(summary);
});

router.get('/trends/:outletId', (req, res) => {
  const { outletId } = req.params;
  const { startDate, endDate } = req.query;
  
  const trends = {
    period: "Daily",
    startDate: startDate,
    endDate: endDate,
    totalSales: 8750.25,
    salesGrowth: 12.5,
    orderGrowth: 8.3,
    trendDirection: "UP"
  };
  
  res.json(trends);
});

router.get('/performance/:outletId', (req, res) => {
  const { outletId } = req.params;
  const { startDate, endDate } = req.query;
  
  const metrics = {
    totalProducts: 25,
    topPerformingCategory: "Spices",
    averageStockTurnover: 2.5,
    lowStockProducts: 3,
    outOfStockProducts: 1
  };
  
  res.json(metrics);
});

// Role-based reporting endpoints

// Owner Dashboard - Full system overview
router.get('/owner/dashboard', checkRole(['owner']), (req, res) => {
  const dashboard = {
    totalOutlets: 2,
    totalSales: 50000.75,
    totalOrders: 1800,
    totalCustomers: 1200,
    averageOrderValue: 27.78,
    topPerformingOutlet: "Main Branch",
    salesGrowth: 15.2,
    orderGrowth: 12.8,
    monthlyRevenue: [
      { month: "Jan", revenue: 45000 },
      { month: "Feb", revenue: 48000 },
      { month: "Mar", revenue: 52000 },
      { month: "Apr", revenue: 50000 },
      { month: "May", revenue: 55000 },
      { month: "Jun", revenue: 50000 }
    ],
    outletPerformance: [
      { outletId: 1, name: "Main Branch", sales: 35000, orders: 1200, growth: 18.5 },
      { outletId: 2, name: "Branch Outlet", sales: 15000, orders: 600, growth: 8.2 }
    ]
  };
  
  res.json(dashboard);
});

// Owner - All outlets sales comparison
router.get('/owner/sales-comparison', checkRole(['owner']), (req, res) => {
  const comparison = {
    currentYear: [
      { month: "Jan", sales: 45000 },
      { month: "Feb", sales: 48000 },
      { month: "Mar", sales: 52000 },
      { month: "Apr", sales: 50000 },
      { month: "May", sales: 55000 },
      { month: "Jun", sales: 50000 },
      { month: "Jul", sales: 48000 },
      { month: "Aug", sales: 52000 },
      { month: "Sep", sales: 55000 },
      { month: "Oct", sales: 58000 },
      { month: "Nov", sales: 60000 },
      { month: "Dec", sales: 61900 }
    ],
    previousYear: [
      { month: "Jan", sales: 40000 },
      { month: "Feb", sales: 42000 },
      { month: "Mar", sales: 45000 },
      { month: "Apr", sales: 43000 },
      { month: "May", sales: 46000 },
      { month: "Jun", sales: 42000 },
      { month: "Jul", sales: 44000 },
      { month: "Aug", sales: 46000 },
      { month: "Sep", sales: 48000 },
      { month: "Oct", sales: 45000 },
      { month: "Nov", sales: 47000 },
      { month: "Dec", sales: 49100 }
    ]
  };
  
  res.json(comparison);
});

// Owner - Top selling products across all outlets
router.get('/owner/top-products', checkRole(['owner']), (req, res) => {
  const topProducts = [
    { id: 1, name: "Traditional Curry Powder", category: "Spices", totalSold: 500, revenue: 7995.00, outlets: 2 },
    { id: 2, name: "Ceylon Tea", category: "Beverages", totalSold: 400, revenue: 5000.00, outlets: 2 },
    { id: 3, name: "Coconut Oil", category: "Oils", totalSold: 200, revenue: 1798.00, outlets: 2 },
    { id: 4, name: "Rice Flour", category: "Flours", totalSold: 300, revenue: 1500.00, outlets: 2 },
    { id: 5, name: "Chili Powder", category: "Spices", totalSold: 250, revenue: 1250.00, outlets: 2 }
  ];
  
  res.json(topProducts);
});

// Factory Staff Dashboard - Production and supply chain focus
router.get('/factory/dashboard', checkRole(['factory_staff', 'owner']), (req, res) => {
  const dashboard = {
    totalProduction: 1000,
    pendingOrders: 25,
    completedOrders: 150,
    averageProductionTime: 2.5,
    topDemandProducts: [
      { name: "Traditional Curry Powder", demand: 200, stock: 150, status: "LOW_STOCK" },
      { name: "Ceylon Tea", demand: 180, stock: 200, status: "IN_STOCK" },
      { name: "Coconut Oil", demand: 120, stock: 80, status: "LOW_STOCK" }
    ],
    productionSchedule: [
      { date: "2024-01-16", product: "Traditional Curry Powder", quantity: 100, status: "SCHEDULED" },
      { date: "2024-01-17", product: "Ceylon Tea", quantity: 150, status: "IN_PROGRESS" },
      { date: "2024-01-18", product: "Coconut Oil", quantity: 80, status: "PENDING" }
    ],
    qualityMetrics: {
      defectRate: 0.5,
      onTimeDelivery: 95.2,
      customerSatisfaction: 4.8
    }
  };
  
  res.json(dashboard);
});

// Factory Staff - Production reports
router.get('/factory/production-report', checkRole(['factory_staff', 'owner']), (req, res) => {
  const { startDate, endDate } = req.query;
  
  const report = {
    period: { startDate, endDate },
    totalProduction: 1000,
    productsProduced: [
      { name: "Traditional Curry Powder", quantity: 400, quality: "EXCELLENT" },
      { name: "Ceylon Tea", quantity: 300, quality: "GOOD" },
      { name: "Coconut Oil", quantity: 200, quality: "EXCELLENT" },
      { name: "Rice Flour", quantity: 100, quality: "GOOD" }
    ],
    efficiency: {
      machineUtilization: 85.5,
      laborEfficiency: 92.3,
      materialWaste: 2.1
    }
  };
  
  res.json(report);
});

// Outlet Staff Dashboard - Sales and inventory focus
router.get('/outlet/:outletId/dashboard', checkRole(['outlet_staff', 'owner']), (req, res) => {
  const { outletId } = req.params;
  
  const dashboard = {
    outletId: parseInt(outletId),
    todaySales: 1250.50,
    todayOrders: 45,
    todayCustomers: 38,
    averageOrderValue: 27.79,
    topSellingProducts: [
      { name: "Traditional Curry Powder", sold: 25, revenue: 399.75 },
      { name: "Ceylon Tea", sold: 20, revenue: 250.00 },
      { name: "Coconut Oil", sold: 15, revenue: 134.85 }
    ],
    inventoryStatus: {
      totalProducts: 25,
      lowStock: 3,
      outOfStock: 1,
      reorderNeeded: 2
    },
    recentOrders: [
      { id: 1, customer: "John Doe", amount: 45.50, time: "2:15 PM", status: "COMPLETED" },
      { id: 2, customer: "Jane Smith", amount: 32.25, time: "2:10 PM", status: "COMPLETED" },
      { id: 3, customer: "Bob Johnson", amount: 67.80, time: "2:05 PM", status: "PENDING" }
    ]
  };
  
  res.json(dashboard);
});

// Outlet Staff - Daily sales report
router.get('/outlet/:outletId/daily-sales', checkRole(['outlet_staff', 'owner']), (req, res) => {
  const { outletId } = req.params;
  const { date } = req.query;
  
  const report = {
    outletId: parseInt(outletId),
    date: date || new Date().toISOString().split('T')[0],
    totalSales: 1250.50,
    totalOrders: 45,
    totalItemsSold: 120,
    averageOrderValue: 27.79,
    hourlyBreakdown: [
      { hour: "09:00", sales: 150.25, orders: 5 },
      { hour: "10:00", sales: 200.50, orders: 8 },
      { hour: "11:00", sales: 180.75, orders: 7 },
      { hour: "12:00", sales: 250.00, orders: 10 },
      { hour: "13:00", sales: 300.25, orders: 12 },
      { hour: "14:00", sales: 169.75, orders: 3 }
    ],
    topProducts: [
      { name: "Traditional Curry Powder", sold: 25, revenue: 399.75 },
      { name: "Ceylon Tea", sold: 20, revenue: 250.00 },
      { name: "Coconut Oil", sold: 15, revenue: 134.85 }
    ]
  };
  
  res.json(report);
});

// Outlet Staff - Inventory report
router.get('/outlet/:outletId/inventory', checkRole(['outlet_staff', 'owner']), (req, res) => {
  const { outletId } = req.params;
  
  const inventory = {
    outletId: parseInt(outletId),
    totalProducts: 25,
    categories: [
      {
        name: "Spices",
        products: [
          { name: "Traditional Curry Powder", stock: 15, minStock: 20, status: "LOW_STOCK" },
          { name: "Chili Powder", stock: 25, minStock: 15, status: "IN_STOCK" },
          { name: "Turmeric Powder", stock: 0, minStock: 10, status: "OUT_OF_STOCK" }
        ]
      },
      {
        name: "Beverages",
        products: [
          { name: "Ceylon Tea", stock: 30, minStock: 20, status: "IN_STOCK" },
          { name: "Coffee", stock: 12, minStock: 15, status: "LOW_STOCK" }
        ]
      }
    ],
    alerts: [
      { type: "LOW_STOCK", product: "Traditional Curry Powder", current: 15, minimum: 20 },
      { type: "OUT_OF_STOCK", product: "Turmeric Powder", current: 0, minimum: 10 },
      { type: "LOW_STOCK", product: "Coffee", current: 12, minimum: 15 }
    ]
  };
  
  res.json(inventory);
});

// Cross-role analytics
router.get('/analytics/sales-trends', checkRole(['owner', 'factory_staff', 'outlet_staff']), (req, res) => {
  const { outletId, period = 'monthly' } = req.query;
  
  const trends = {
    period,
    outletId: outletId ? parseInt(outletId) : null,
    data: [
      { period: "2024-01", sales: 45000, orders: 1200, growth: 12.5 },
      { period: "2024-02", sales: 48000, orders: 1300, growth: 6.7 },
      { period: "2024-03", sales: 52000, orders: 1400, growth: 8.3 },
      { period: "2024-04", sales: 50000, orders: 1350, growth: -3.8 },
      { period: "2024-05", sales: 55000, orders: 1500, growth: 10.0 },
      { period: "2024-06", sales: 50000, orders: 1400, growth: -9.1 }
    ]
  };
  
  res.json(trends);
});

module.exports = router;
