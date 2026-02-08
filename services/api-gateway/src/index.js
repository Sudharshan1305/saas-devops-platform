// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const setupRoutes = require('./config/routes');
// const { generalLimiter, authLimiter } = require('./config/rateLimit');
// const logger = require('./middleware/logger');
// const securityHeaders = require('./middleware/security');
// const swaggerSpec = require('./swagger/swagger');

// const app = express();
// app.set('trust proxy', 1);

// // Middleware
// app.use(cors());
// //app.use(express.json());
// //app.use(express.urlencoded({ extended: true }));
// app.use(securityHeaders);
// app.use(logger);

// app.use(securityHeaders);
// app.use(logger);

// // Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Welcome
// app.get('/', (req, res) => {
//     res.json({
//         message: '🚀 SaaS Platform API Gateway',
//         services: {
//             auth: process.env.AUTH_SERVICE_URL,
//             billing: process.env.BILLING_SERVICE_URL,
//             usage: process.env.USAGE_SERVICE_URL,
//             admin: process.env.ADMIN_SERVICE_URL,
//         },
//     });
// });

// // Health
// app.get('/health', (req, res) => {
//     res.json({ status: 'OK', service: 'API Gateway' });
// });

// // Rate limiting
// app.use('/api/auth/login', authLimiter);
// app.use('/api/auth/register', authLimiter);
// app.use('/api', generalLimiter);

// // 🔗 Setup proxy routes
// setupRoutes(app);

// // 404
// app.use((req, res) => {
//     res.status(404).json({ success: false, message: 'Route not found' });
// });

// // Error
// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Internal server error' });
// });

// // Start
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 API Gateway running on port ${PORT}`);
//     console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
// });
// ----------------------------------------------------------------------------------------
// // 🚨 MUST BE FIRST
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const setupRoutes = require('./config/routes');
// const { generalLimiter, authLimiter } = require('./config/rateLimit');
// const logger = require('./middleware/logger');
// const securityHeaders = require('./middleware/security');
// const swaggerSpec = require('./swagger/swagger');

// const app = express();
// app.set('trust proxy', 1);

// // Basic middleware
// app.use(cors());
// app.use(securityHeaders);
// app.use(logger);

// // Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Health
// app.get('/health', (req, res) => {
//     res.json({ status: 'OK', service: 'API Gateway' });
// });

// // Rate limiting
// app.use('/api/auth/login', authLimiter);
// app.use('/api/auth/register', authLimiter);
// app.use('/api', generalLimiter);

// // Welcome route (ROOT)
// app.get('/', (req, res) => {
//     res.json({
//         message: '🚀 SaaS Platform API Gateway',
//         version: '1.0.0',
//         documentation: '/api-docs',
//         services: {
//             auth: process.env.AUTH_SERVICE_URL,
//             billing: process.env.BILLING_SERVICE_URL,
//             usage: process.env.USAGE_SERVICE_URL,
//             admin: process.env.ADMIN_SERVICE_URL,
//         },
//     });
// });


// // 🔗 PROXY ROUTES — MUST BE HERE
// setupRoutes(app);

// // ❌ DO NOT put anything that ends requests before this point

// // 404 handler — MUST BE LAST
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route not found',
//     });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error('💥 Error:', err);
//     res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//     });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 API Gateway running on port ${PORT}`);
//     console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
// });
//-------------------------------------------------------------------------------
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');

// const setupRoutes = require('./config/routes');
// const { generalLimiter, authLimiter } = require('./config/rateLimit');
// const logger = require('./middleware/logger');
// const securityHeaders = require('./middleware/security');
// const swaggerSpec = require('./swagger/swagger');

// const app = express();
// app.set('trust proxy', 1);

// // --------------------
// // Core middleware
// // --------------------
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(securityHeaders);
// app.use(logger);

// // --------------------
// // Swagger Docs
// // --------------------
// app.use(
//     '/api-docs',
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerSpec, {
//         customCss: '.swagger-ui .topbar { display: none }',
//         customSiteTitle: 'SaaS Platform API Docs',
//     })
// );

// // --------------------
// // Health check
// // --------------------
// app.get('/health', (req, res) => {
//     res.status(200).json({
//         status: 'OK',
//         service: 'API Gateway',
//         timestamp: new Date().toISOString(),
//     });
// });

// // --------------------
// // Rate limiting
// // --------------------
// app.use('/api/auth/login', authLimiter);
// app.use('/api/auth/register', authLimiter);
// app.use('/api', generalLimiter);

// // --------------------
// // Proxy routes
// // --------------------
// setupRoutes(app);

// // --------------------
// // 404 handler
// // --------------------
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route not found',
//     });
// });

// // --------------------
// // Error handler
// // --------------------
// app.use((err, req, res, next) => {
//     console.error('💥 Gateway Error:', err);
//     res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//     });
// });

// // --------------------
// // Start server
// // --------------------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log('='.repeat(60));
//     console.log(`🚀 API Gateway running on port ${PORT}`);
//     console.log(`📝 Environment: ${process.env.NODE_ENV}`);
//     console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
//     console.log('='.repeat(60));
// });
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const setupRoutes = require('./config/routes');
const logger = require('./middleware/logger');
const securityHeaders = require('./middleware/security');
const swaggerSpec = require('./swagger/swagger');

const app = express();
app.set('trust proxy', 1);

// DO NOT parse JSON here
app.use(cors());
app.use(securityHeaders);
app.use(logger);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'API Gateway',
    });
});

// 🔗 PROXY — MUST BE BEFORE 404
setupRoutes(app);

// 404 LAST
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
});
