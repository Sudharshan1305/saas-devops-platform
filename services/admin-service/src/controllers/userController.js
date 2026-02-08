const adminService = require('../services/adminService');

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error('Get all users error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};