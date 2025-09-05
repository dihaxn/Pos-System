const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Comment out authentication for now
// const { authenticate } = require('../middlewares/authMiddleware');

// Rate limiting for auth endpoints to prevent DoS attacks
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

// Login endpoint with rate limiting
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }

    const user = await authenticateUser(username, password);
    
    if (user) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.userId,
          username: user.userName,
          role: user.roleId,
          outletid: user.outletID
        },
        'your-secret-key', // In production, use environment variable
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token: token,
        user: {
          userId: user.userId,
          userName: user.userName,
          roleId: user.roleId,
          outletID: user.outletID
        }
      });
    } else {
      res.status(401).json({ 
        message: 'Invalid username or password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// Logout endpoint (optional, since JWT is stateless)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Get current user info
router.get('/me', (req, res) => {
  // For now, return mock user info
  res.json({
    userId: 3,
    userName: 'owner',
    roleId: 3,
    outletID: 1
  });
});

module.exports = router;
