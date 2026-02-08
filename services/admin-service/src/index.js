require('dotenv').config();

const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');

// Create Express app
const app = express();

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
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Admin Service' });
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
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
    console.log(`🚀 Admin Service running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});
