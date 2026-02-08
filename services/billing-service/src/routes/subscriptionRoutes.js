const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    next();
};

// All routes require authentication
router.use(authenticate);

// Get user's current subscription
router.get('/my-subscription', subscriptionController.getMySubscription);

// Create new subscription
router.post(
    '/subscribe',
    body('planId').notEmpty().withMessage('Plan ID is required'),
    validate,
    subscriptionController.createSubscription
);

// Create Stripe Checkout Session
router.post(
    '/create-checkout-session',
    body('planId').notEmpty().withMessage('Plan ID is required'),
    validate,
    subscriptionController.createCheckoutSession
);

// Cancel subscription
router.post('/cancel', subscriptionController.cancelSubscription);

// Reactivate subscription
router.post('/reactivate', subscriptionController.reactivateSubscription);

// Update subscription (upgrade/downgrade)
router.put(
    '/update',
    body('planId').notEmpty().withMessage('Plan ID is required'),
    validate,
    subscriptionController.updateSubscription
);

module.exports = router;