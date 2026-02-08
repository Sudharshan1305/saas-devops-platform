const billingService = require('../services/billingService');

// GET /api/subscriptions/plans
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await billingService.getAllPlans();

        res.status(200).json({
            success: true,
            data: plans,
        });
    } catch (error) {
        console.error('Get plans error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/subscriptions/my-subscription
exports.getMySubscription = async (req, res) => {
    try {
        const userId = req.user.userId; // From auth middleware
        const subscription = await billingService.getUserSubscription(userId);

        res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        console.error('Get subscription error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/subscriptions/subscribe
exports.createSubscription = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { planId } = req.body;

        // In real app, get user details from auth service
        const userEmail = req.user.email || 'user@example.com';
        const userName = req.user.name || 'User';

        const result = await billingService.createSubscription(
            userId,
            userEmail,
            userName,
            planId
        );

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: result,
        });
    } catch (error) {
        console.error('Create subscription error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/subscriptions/create-checkout-session
exports.createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { planId } = req.body;

        const userEmail = req.user.email || 'user@example.com';
        const userName = req.user.name || 'User';

        const successUrl = `${req.protocol}://${req.get('host')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${req.protocol}://${req.get('host')}/subscription/cancel`;

        const result = await billingService.createCheckoutSession(
            userId,
            userEmail,
            userName,
            planId,
            successUrl,
            cancelUrl
        );

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Create checkout session error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/subscriptions/cancel
exports.cancelSubscription = async (req, res) => {
    try {
        const userId = req.user.userId;

        const subscription = await billingService.cancelSubscription(userId);

        res.status(200).json({
            success: true,
            message: 'Subscription will be canceled at period end',
            data: subscription,
        });
    } catch (error) {
        console.error('Cancel subscription error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/subscriptions/reactivate
exports.reactivateSubscription = async (req, res) => {
    try {
        const userId = req.user.userId;

        const subscription = await billingService.reactivateSubscription(userId);

        res.status(200).json({
            success: true,
            message: 'Subscription reactivated successfully',
            data: subscription,
        });
    } catch (error) {
        console.error('Reactivate subscription error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// PUT /api/subscriptions/update
exports.updateSubscription = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { planId } = req.body;

        const subscription = await billingService.updateSubscription(userId, planId);

        res.status(200).json({
            success: true,
            message: 'Subscription updated successfully',
            data: subscription,
        });
    } catch (error) {
        console.error('Update subscription error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};