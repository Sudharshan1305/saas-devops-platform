const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SaaS Platform API',
            version: '1.0.0',
            description: 'Complete API documentation for the SaaS Platform',
            contact: {
                name: 'API Support',
                email: 'support@saasplatform.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication endpoints',
            },
            {
                name: 'Billing',
                description: 'Subscription and payment endpoints',
            },
            {
                name: 'Usage',
                description: 'API usage tracking endpoints',
            },
            {
                name: 'Admin',
                description: 'Admin-only endpoints',
            },
        ],
    },
    apis: ['./src/swagger/docs/*.js'], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;