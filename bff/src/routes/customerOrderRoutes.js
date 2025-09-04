const express = require('express');
const router = express.Router();

// Mock customer order data
const mockCustomerOrders = [
  {
    id: 1,
    orderNumber: "CO-001",
    customerName: "John Doe",
    customerPhone: "+1234567890",
    outletId: 1,
    outletName: "Main Branch",
    status: "COMPLETED",
    totalAmount: 45.97,
    items: [
      {
        productId: 1,
        productName: "Traditional Curry Powder",
        quantity: 2,
        unitPrice: 15.99,
        total: 31.98
      },
      {
        productId: 2,
        productName: "Ceylon Tea",
        quantity: 1,
        unitPrice: 12.50,
        total: 12.50
      }
    ],
    paymentMethod: "CASH",
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T10:45:00Z"
  },
  {
    id: 2,
    orderNumber: "CO-002",
    customerName: "Jane Smith",
    customerPhone: "+0987654321",
    outletId: 1,
    outletName: "Main Branch",
    status: "PENDING",
    totalAmount: 26.48,
    items: [
      {
        productId: 3,
        productName: "Coconut Oil",
        quantity: 2,
        unitPrice: 8.99,
        total: 17.98
      },
      {
        productId: 2,
        productName: "Ceylon Tea",
        quantity: 1,
        unitPrice: 12.50,
        total: 12.50
      }
    ],
    paymentMethod: "CARD",
    createdAt: "2024-01-15T11:15:00Z"
  }
];

// Get orders by outlet
router.get('/by-outlet/:outletId', (req, res) => {
  const { outletId } = req.params;
  const orders = mockCustomerOrders.filter(o => o.outletId === parseInt(outletId));
  res.json(orders);
});

// Get order items
router.get('/items/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = mockCustomerOrders.find(o => o.id === parseInt(orderId));
  if (order) {
    res.json(order.items);
  } else {
    res.status(404).json({ message: 'Customer order not found' });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const order = mockCustomerOrders.find(o => o.id === parseInt(id));
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Customer order not found' });
  }
});

// Create new customer order
router.post('/', (req, res) => {
  const newOrder = {
    id: mockCustomerOrders.length + 1,
    orderNumber: `CO-${String(mockCustomerOrders.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  mockCustomerOrders.push(newOrder);
  res.status(201).json(newOrder);
});

// Update order status
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const orderIndex = mockCustomerOrders.findIndex(o => o.id === parseInt(id));
  if (orderIndex !== -1) {
    mockCustomerOrders[orderIndex].status = status;
    if (status === 'COMPLETED') {
      mockCustomerOrders[orderIndex].completedAt = new Date().toISOString();
    }
    res.json(mockCustomerOrders[orderIndex]);
  } else {
    res.status(404).json({ message: 'Customer order not found' });
  }
});

module.exports = router;
