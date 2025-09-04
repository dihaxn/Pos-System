const express = require('express');
const router = express.Router();
const { updatePrice } = require('../controllers/product-service/priceController');

// Comment out authentication for now
// const { authenticate } = require('../middlewares/authMiddleware');

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: "Traditional Curry Powder",
    description: "Authentic Sri Lankan curry powder blend",
    price: 15.99,
    stockQuantity: 150,
    status: "ACTIVE",
    category: "Spices",
    outletId: 1
  },
  {
    id: 2,
    name: "Ceylon Tea",
    description: "Premium black tea from Sri Lanka",
    price: 12.50,
    stockQuantity: 200,
    status: "ACTIVE",
    category: "Beverages",
    outletId: 1
  },
  {
    id: 3,
    name: "Coconut Oil",
    description: "Pure virgin coconut oil",
    price: 8.99,
    stockQuantity: 75,
    status: "ACTIVE",
    category: "Oils",
    outletId: 1
  }
];

// Get all products
router.get('', (req, res) => {
  res.json(mockProducts);
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Get products by category
router.get('/category/:category', (req, res) => {
  const products = mockProducts.filter(p => 
    p.category.toLowerCase() === req.params.category.toLowerCase()
  );
  res.json(products);
});

// Search products
router.get('/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const products = mockProducts.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.description.toLowerCase().includes(query)
  );
  res.json(products);
});

// Create product
router.post('', (req, res) => {
  const newProduct = {
    id: mockProducts.length + 1,
    ...req.body,
    status: "ACTIVE"
  };
  mockProducts.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product
router.put('/:id', (req, res) => {
  const index = mockProducts.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...req.body };
    res.json(mockProducts[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Update product status
router.put('/:id/status', (req, res) => {
  const product = mockProducts.find(p => p.id === parseInt(req.params.id));
  if (product) {
    product.status = req.body.status;
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Comment out authentication for update price
// router.put('', authenticate, updatePrice);
router.put('/price', updatePrice);

module.exports = router;