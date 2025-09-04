const express = require('express');
const router = express.Router();

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: "Low Stock Alert",
    message: "Traditional Curry Powder is running low (5 units remaining)",
    type: "WARNING",
    outletId: 1,
    productId: 1,
    isRead: false,
    createdAt: "2024-01-15T09:30:00Z"
  },
  {
    id: 2,
    title: "Order Completed",
    message: "Factory Order FO-002 has been delivered successfully",
    type: "SUCCESS",
    outletId: 2,
    orderId: 2,
    isRead: true,
    createdAt: "2024-01-12T14:15:00Z"
  },
  {
    id: 3,
    title: "New Return Request",
    message: "Customer John Doe has requested a return for Order CO-001",
    type: "INFO",
    outletId: 1,
    returnId: 1,
    isRead: false,
    createdAt: "2024-01-15T11:00:00Z"
  }
];

// Get all notifications
router.get('/', (req, res) => {
  res.json(mockNotifications);
});

// Get notifications by outlet
router.get('/outlet/:outletId', (req, res) => {
  const { outletId } = req.params;
  const notifications = mockNotifications.filter(n => n.outletId === parseInt(outletId));
  res.json(notifications);
});

// Get unread notifications
router.get('/unread', (req, res) => {
  const unreadNotifications = mockNotifications.filter(n => !n.isRead);
  res.json(unreadNotifications);
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
  const { id } = req.params;
  const notificationIndex = mockNotifications.findIndex(n => n.id === parseInt(id));
  if (notificationIndex !== -1) {
    mockNotifications[notificationIndex].isRead = true;
    res.json(mockNotifications[notificationIndex]);
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
});

// Create new notification
router.post('/', (req, res) => {
  const newNotification = {
    id: mockNotifications.length + 1,
    ...req.body,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  mockNotifications.push(newNotification);
  res.status(201).json(newNotification);
});

// Delete notification
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const notificationIndex = mockNotifications.findIndex(n => n.id === parseInt(id));
  if (notificationIndex !== -1) {
    const deletedNotification = mockNotifications.splice(notificationIndex, 1)[0];
    res.json(deletedNotification);
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
});

module.exports = router;
