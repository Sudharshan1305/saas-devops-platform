require('dotenv').config();

const express = require('express');
const cors = require('cors');
//const dotenv = require('dotenv');
const connectDB = require('./config/db');
const planRoutes = require('./routes/planRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const webhookController = require('./controllers/webhookController');

// Load environment variables
//dotenv.config();

// Create Express app
const app = express();

// Webhook route MUST be before express.json() middleware
// Stripe needs raw body for signature verification
app.post(
    '/api/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    webhookController.handleStripeWebhook
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logging
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Billing Service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
    });
});

// Start server
const PORT = process.env.PORT || 5002;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Billing Service running on port ${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();