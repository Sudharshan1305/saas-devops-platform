const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usageController');
const { authenticate } = require('../middleware/auth');
const { checkRateLimit } = require('../middleware/rateLimit');

// All routes require authentication
router.use(authenticate);

// Track usage (typically called by API gateway or other services)
router.post('/track', usageController.trackUsage);

// Get current month usage
router.get('/current', usageController.getCurrentUsage);

// Check usage limits
router.get('/limits', usageController.checkLimits);

// Get usage statistics
router.get('/stats', usageController.getStats);

// Demo endpoint to test rate limiting
router.get('/demo', checkRateLimit, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'This is a rate-limited demo endpoint',
        usageInfo: req.usageInfo,
    });
});

module.exports = router;