const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    try {
        // Check for internal service call (x-user-id header)
        const userIdHeader = req.headers['x-user-id'];
        if (userIdHeader) {
            req.user = { userId: userIdHeader };
            return next();
        }

        // Check for JWT token
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }

        const token = authHeader.split(' ')[1];

        // Decode token (in production, verify with auth service or shared secret)
        const decoded = jwt.decode(token);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Authentication failed',
        });
    }
};