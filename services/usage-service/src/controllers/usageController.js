const usageService = require('../services/usageService');

// POST /api/usage/track
exports.trackUsage = async (req, res) => {
    try {
        const userId = req.user?.userId || req.headers['x-user-id'];
        const { endpoint, method, statusCode, responseTime, metadata } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }

        const usage = await usageService.trackUsage(
            userId,
            endpoint,
            method,
            statusCode,
            responseTime,
            metadata
        );

        res.status(201).json({
            success: true,
            message: 'Usage tracked successfully',
            data: usage,
        });
    } catch (error) {
        console.error('Track usage error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/usage/current
exports.getCurrentUsage = async (req, res) => {
    try {
        const userId = req.user.userId;

        const currentUsage = await usageService.getMonthlyUsage(userId);

        res.status(200).json({
            success: true,
            data: {
                currentMonth: currentUsage,
                period: new Date().toISOString().slice(0, 7), // YYYY-MM
            },
        });
    } catch (error) {
        console.error('Get current usage error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/usage/limits
exports.checkLimits = async (req, res) => {
    try {
        const userId = req.user.userId;

        const limits = await usageService.checkUsageLimit(userId);

        res.status(200).json({
            success: true,
            data: limits,
        });
    } catch (error) {
        console.error('Check limits error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/usage/stats
exports.getStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Default to current month if no dates provided
        const now = new Date();
        const startDate = req.query.startDate
            ? new Date(req.query.startDate)
            : new Date(now.getFullYear(), now.getMonth(), 1);

        const endDate = req.query.endDate
            ? new Date(req.query.endDate)
            : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const stats = await usageService.getUserStats(userId, startDate, endDate);

        res.status(200).json({
            success: true,
            data: {
                period: {
                    start: startDate,
                    end: endDate,
                },
                stats,
            },
        });
    } catch (error) {
        console.error('Get stats error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};