const express = require('express');
const router = express.Router();

// Comment out authentication for now
// const { authenticate } = require('../middlewares/authMiddleware');

// Mock outlet data
const mockOutlets = [
  {
    id: 1,
    name: "Main Outlet",
    address: "123 Main Street, Colombo",
    phone: "+94 11 123 4567",
    email: "main@littlelanka.com",
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "Branch Outlet",
    address: "456 Branch Road, Kandy",
    phone: "+94 81 234 5678",
    email: "branch@littlelanka.com",
    status: "ACTIVE"
  }
];

// Get all outlets
router.get('', (req, res) => {
  res.json(mockOutlets);
});

// Get outlet by ID
router.get('/:id', (req, res) => {
  const outlet = mockOutlets.find(o => o.id === parseInt(req.params.id));
  if (outlet) {
    res.json(outlet);
  } else {
    res.status(404).json({ message: 'Outlet not found' });
  }
});

// Get outlet by ID (alternative endpoint for POS system)
router.get('/get-outlet-by-id', (req, res) => {
  const outletId = req.query['outlet-id'];
  if (!outletId) {
    return res.status(400).json({ message: 'outlet-id parameter is required' });
  }
  
  const outlet = mockOutlets.find(o => o.id === parseInt(outletId));
  if (outlet) {
    res.json(outlet);
  } else {
    res.status(404).json({ message: 'Outlet not found' });
  }
});

// Get outlets by status
router.get('/status/:status', (req, res) => {
  const outlets = mockOutlets.filter(o => 
    o.status.toLowerCase() === req.params.status.toLowerCase()
  );
  res.json(outlets);
});

// Search outlets
router.get('/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const outlets = mockOutlets.filter(o => 
    o.name.toLowerCase().includes(query) || 
    o.address.toLowerCase().includes(query)
  );
  res.json(outlets);
});

// Create outlet
router.post('', (req, res) => {
  const newOutlet = {
    id: mockOutlets.length + 1,
    ...req.body,
    status: "ACTIVE"
  };
  mockOutlets.push(newOutlet);
  res.status(201).json(newOutlet);
});

// Update outlet
router.put('/:id', (req, res) => {
  const index = mockOutlets.findIndex(o => o.id === parseInt(req.params.id));
  if (index !== -1) {
    mockOutlets[index] = { ...mockOutlets[index], ...req.body };
    res.json(mockOutlets[index]);
  } else {
    res.status(404).json({ message: 'Outlet not found' });
  }
});

// Update outlet status
router.put('/:id/status', (req, res) => {
  const outlet = mockOutlets.find(o => o.id === parseInt(req.params.id));
  if (outlet) {
    outlet.status = req.body.status;
    res.json(outlet);
  } else {
    res.status(404).json({ message: 'Outlet not found' });
  }
});

module.exports = router;
