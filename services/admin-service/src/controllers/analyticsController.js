const adminService = require('../services/adminService');

// GET /api/admin/analytics/revenue
exports.getRevenueAnalytics = async (req, res) => {
    try {
        const analytics = await adminService.getRevenueAnalytics();

        res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        console.error('Get revenue analytics error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/admin/analytics/usage
exports.getUsageAnalytics = async (req, res) => {
    try {
        const analytics = await adminService.getUsageAnalytics();

        res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        console.error('Get usage analytics error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/admin/analytics/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const dashboard = await adminService.getDashboardSummary();

        res.status(200).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        console.error('Get dashboard error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/admin/health
exports.getSystemHealth = async (req, res) => {
    try {
        const health = await adminService.getSystemHealth();

        res.status(200).json({
            success: true,
            data: health,
        });
    } catch (error) {
        console.error('Get system health error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};