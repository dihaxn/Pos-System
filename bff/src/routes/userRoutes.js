const express = require('express');
const router = express.Router();

// Comment out authentication for now
// const { authenticate } = require('../middlewares/authMiddleware');

// Mock user data
const mockUsers = [
  {
    userId: 1,
    userName: "outlet_staff",
    password: "outlet123",
    roleId: 1,
    outletID: 1,
    status: "ACTIVE"
  },
  {
    userId: 2,
    userName: "factory_staff",
    password: "factory123",
    roleId: 2,
    outletID: 1,
    status: "ACTIVE"
  },
  {
    userId: 3,
    userName: "owner",
    password: "owner123",
    roleId: 3,
    outletID: 1,
    status: "ACTIVE"
  }
];

// Get all users
router.get('', (req, res) => {
  // Don't return passwords in the response
  const usersWithoutPasswords = mockUsers.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  res.json(usersWithoutPasswords);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = mockUsers.find(u => u.userId === parseInt(req.params.id));
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Search users
router.get('/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const users = mockUsers.filter(u => 
    u.userName.toLowerCase().includes(query)
  );
  
  // Don't return passwords in the response
  const usersWithoutPasswords = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json(usersWithoutPasswords);
});

// Create user
router.post('', (req, res) => {
  const newUser = {
    userId: mockUsers.length + 1,
    ...req.body,
    status: "ACTIVE"
  };
  mockUsers.push(newUser);
  
  const { password, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// Update user
router.put('/:id', (req, res) => {
  const index = mockUsers.findIndex(u => u.userId === parseInt(req.params.id));
  if (index !== -1) {
    mockUsers[index] = { ...mockUsers[index], ...req.body };
    const { password, ...userWithoutPassword } = mockUsers[index];
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Update user status
router.put('/:id/status', (req, res) => {
  const user = mockUsers.find(u => u.userId === parseInt(req.params.id));
  if (user) {
    user.status = req.body.status;
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
