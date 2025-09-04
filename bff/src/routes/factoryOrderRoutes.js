const express = require('express');
const router = express.Router();

// Mock factory order data
const mockFactoryOrders = [
  {
    id: 1,
    orderNumber: "FO-001",
    outletId: 1,
    outletName: "Main Branch",
    status: "PENDING",
    totalAmount: 150.00,
    items: [
      {
        productId: 1,
        productName: "Traditional Curry Powder",
        quantity: 10,
        unitPrice: 15.99
      },
      {
        productId: 2,
        productName: "Ceylon Tea",
        quantity: 5,
        unitPrice: 12.50
      }
    ],
    createdAt: "2024-01-15T09:00:00Z",
    expectedDelivery: "2024-01-20T09:00:00Z"
  },
  {
    id: 2,
    orderNumber: "FO-002",
    outletId: 2,
    outletName: "Branch 2",
    status: "DELIVERED",
    totalAmount: 89.95,
    items: [
      {
        productId: 3,
        productName: "Coconut Oil",
        quantity: 10,
        unitPrice: 8.99
      }
    ],
    createdAt: "2024-01-10T11:30:00Z",
    deliveredAt: "2024-01-12T14:00:00Z"
  }
];

// Get orders by status
router.get('/by-status/:status', (req, res) => {
  const { status } = req.params;
  const orders = mockFactoryOrders.filter(o => o.status.toLowerCase() === status.toLowerCase());
  res.json(orders);
});

// Get order by ID
router.get('/by-id/:id', (req, res) => {
  const { id } = req.params;
  const order = mockFactoryOrders.find(o => o.id === parseInt(id));
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Factory order not found' });
  }
});

// Get order items
router.get('/items/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = mockFactoryOrders.find(o => o.id === parseInt(orderId));
  if (order) {
    res.json(order.items);
  } else {
    res.status(404).json({ message: 'Factory order not found' });
  }
});

// Update order status
router.put('/status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const orderIndex = mockFactoryOrders.findIndex(o => o.id === parseInt(id));
  if (orderIndex !== -1) {
    mockFactoryOrders[orderIndex].status = status;
    if (status === 'DELIVERED') {
      mockFactoryOrders[orderIndex].deliveredAt = new Date().toISOString();
    }
    res.json(mockFactoryOrders[orderIndex]);
  } else {
    res.status(404).json({ message: 'Factory order not found' });
  }
});

// Create new factory order
router.post('/', (req, res) => {
  const newOrder = {
    id: mockFactoryOrders.length + 1,
    orderNumber: `FO-${String(mockFactoryOrders.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  mockFactoryOrders.push(newOrder);
  res.status(201).json(newOrder);
});

module.exports = router;
