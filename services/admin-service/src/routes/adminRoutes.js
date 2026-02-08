const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const analyticsController = require('../controllers/analyticsController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// User management routes
router.get('/users', userController.getAllUsers);

// Analytics routes
router.get('/analytics/revenue', analyticsController.getRevenueAnalytics);
router.get('/analytics/usage', analyticsController.getUsageAnalytics);
router.get('/analytics/dashboard', analyticsController.getDashboard);

// System health
router.get('/health', analyticsController.getSystemHealth);

module.exports = router;