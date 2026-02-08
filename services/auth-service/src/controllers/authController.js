const authService = require('../services/authService');

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        console.log('📝 Registration request received:', req.body);
        const result = await authService.register(req.body);
        console.log('✅ Registration successful');

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        console.error('Stack:', error.stack);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('❌ Refresh token error:', error.message);
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/auth/profile
exports.getProfile = async (req, res) => {
    try {
        const result = await authService.getProfile(req.user.userId);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('❌ Get profile error:', error.message);
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};