const usageService = require('../services/usageService');

// Middleware to check if user has exceeded their usage limit
exports.checkRateLimit = async (req, res, next) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        // Check usage limits
        const limits = await usageService.checkUsageLimit(userId);

        // Add usage info to response headers
        res.setHeader('X-RateLimit-Limit', limits.limit);
        res.setHeader('X-RateLimit-Remaining', limits.remaining);
        res.setHeader('X-RateLimit-Used', limits.current);

        // If exceeded, block the request
        if (limits.exceeded) {
            return res.status(429).json({
                success: false,
                message: 'API usage limit exceeded for your plan',
                data: {
                    current: limits.current,
                    limit: limits.limit,
                    resetDate: this.getNextMonthStart(),
                },
            });
        }

        // Attach usage info to request for logging
        req.usageInfo = limits;

        next();
    } catch (error) {
        console.error('Rate limit check error:', error);
        // On error, allow the request (fail open)
        next();
    }
};

// Helper to get next month start date
exports.getNextMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
};