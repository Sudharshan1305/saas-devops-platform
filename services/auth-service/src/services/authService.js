const User = require('../models/userModel');
const tokenService = require('./tokenService');

class AuthService {
    // Register new user
    async register(userData) {
        const { name, email, password } = userData;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: 'USER',
        });

        // Generate tokens
        const accessToken = tokenService.generateAccessToken(user._id, user.role);
        const refreshToken = tokenService.generateRefreshToken(user._id);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }

    // Login user
    async login(email, password) {
        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check if account is active
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate tokens
        const accessToken = tokenService.generateAccessToken(user._id, user.role);
        const refreshToken = tokenService.generateRefreshToken(user._id);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }

    // Refresh access token
    async refreshToken(refreshToken) {
        const decoded = tokenService.verifyRefreshToken(refreshToken);

        const user = await User.findById(decoded.userId);
        if (!user || !user.isActive) {
            throw new Error('User not found or inactive');
        }

        const newAccessToken = tokenService.generateAccessToken(user._id, user.role);

        return {
            accessToken: newAccessToken,
        };
    }

    // Get user profile
    async getProfile(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
}

module.exports = new AuthService();