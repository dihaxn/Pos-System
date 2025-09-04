const express = require('express');
const router = express.Router();

// Mock return data
const mockReturns = [
  {
    id: 1,
    orderId: "ORD-001",
    productId: 1,
    productName: "Traditional Curry Powder",
    quantity: 2,
    reason: "Damaged packaging",
    status: "PENDING",
    outletId: 1,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    orderId: "ORD-002", 
    productId: 2,
    productName: "Ceylon Tea",
    quantity: 1,
    reason: "Customer changed mind",
    status: "APPROVED",
    outletId: 1,
    createdAt: "2024-01-14T14:20:00Z"
  }
];

// Get all returns not pending
router.get('/all-not-pending', (req, res) => {
  const nonPendingReturns = mockReturns.filter(r => r.status !== 'PENDING');
  res.json(nonPendingReturns);
});

// Get returns by status
router.get('/all-by-status/:status', (req, res) => {
  const { status } = req.params;
  const returns = mockReturns.filter(r => r.status.toLowerCase() === status.toLowerCase());
  res.json(returns);
});

// Get returns by outlet ID
router.get('/all-by-outletId/:outletId', (req, res) => {
  const { outletId } = req.params;
  const returns = mockReturns.filter(r => r.outletId === parseInt(outletId));
  res.json(returns);
});

// Update return status
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const returnIndex = mockReturns.findIndex(r => r.id === parseInt(id));
  if (returnIndex !== -1) {
    mockReturns[returnIndex].status = status;
    res.json(mockReturns[returnIndex]);
  } else {
    res.status(404).json({ message: 'Return not found' });
  }
});

// Create new return
router.post('/', (req, res) => {
  const newReturn = {
    id: mockReturns.length + 1,
    ...req.body,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  mockReturns.push(newReturn);
  res.status(201).json(newReturn);
});

module.exports = router;
