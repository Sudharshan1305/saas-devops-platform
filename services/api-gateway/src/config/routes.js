// const { createProxyMiddleware } = require('http-proxy-middleware');

// // Service URLs from environment
// const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
// const BILLING_SERVICE_URL = process.env.BILLING_SERVICE_URL;
// const USAGE_SERVICE_URL = process.env.USAGE_SERVICE_URL;
// const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL;

// // Proxy options for each service
// const createProxy = (target, pathRewrite = {}) => {
//     return createProxyMiddleware({
//         target,
//         changeOrigin: true,
//         pathRewrite,
//         onProxyReq: (proxyReq, req, res) => {
//             // Log proxied requests
//             console.log(`🔄 Proxying: ${req.method} ${req.originalUrl} → ${target}${req.url}`);
//         },
//         onError: (err, req, res) => {
//             console.error(`❌ Proxy error for ${req.url}:`, err.message);
//             res.status(500).json({
//                 success: false,
//                 message: 'Service temporarily unavailable',
//             });
//         },
//     });
// };

// // Route configurations
// const routes = [
//     {
//         path: '/api/auth',
//         target: AUTH_SERVICE_URL,
//         proxy: createProxy(AUTH_SERVICE_URL),
//     },
//     {
//         path: '/api/plans',
//         target: BILLING_SERVICE_URL,
//         proxy: createProxy(BILLING_SERVICE_URL),
//     },
//     {
//         path: '/api/subscriptions',
//         target: BILLING_SERVICE_URL,
//         proxy: createProxy(BILLING_SERVICE_URL),
//     },
//     {
//         path: '/api/webhooks',
//         target: BILLING_SERVICE_URL,
//         proxy: createProxy(BILLING_SERVICE_URL),
//     },
//     {
//         path: '/api/usage',
//         target: USAGE_SERVICE_URL,
//         proxy: createProxy(USAGE_SERVICE_URL),
//     },
//     {
//         path: '/api/admin',
//         target: ADMIN_SERVICE_URL,
//         proxy: createProxy(ADMIN_SERVICE_URL),
//     },
// ];

// module.exports = routes;

// const { createProxyMiddleware } = require('http-proxy-middleware');

// const createProxy = (path, target) => {
//     if (!target) {
//         throw new Error(`❌ Missing target for proxy path: ${path}`);
//     }

//     return createProxyMiddleware({
//         target,
//         changeOrigin: true,
//         logLevel: 'debug',
//         onProxyReq: (proxyReq, req) => {
//             console.log(`🔄 ${req.method} ${req.originalUrl} → ${target}`);
//         },
//         onError: (err, req, res) => {
//             console.error(`❌ Proxy error (${path}):`, err.message);
//             res.status(502).json({
//                 success: false,
//                 message: 'Service temporarily unavailable',
//             });
//         },
//     });
// };

// module.exports = (app) => {
//     app.use('/api/auth', createProxy('/api/auth', process.env.AUTH_SERVICE_URL));
//     app.use('/api/plans', createProxy('/api/plans', process.env.BILLING_SERVICE_URL));
//     app.use('/api/subscriptions', createProxy('/api/subscriptions', process.env.BILLING_SERVICE_URL));
//     app.use('/api/webhooks', createProxy('/api/webhooks', process.env.BILLING_SERVICE_URL));
//     app.use('/api/usage', createProxy('/api/usage', process.env.USAGE_SERVICE_URL));
//     app.use('/api/admin', createProxy('/api/admin', process.env.ADMIN_SERVICE_URL));
// };

// const { createProxyMiddleware } = require('http-proxy-middleware');

// const createProxy = (path, target) => {
//     if (!target) {
//         throw new Error(`❌ Missing target for proxy path: ${path}`);
//     }

//     return createProxyMiddleware({
//         target,
//         changeOrigin: true,
//         logLevel: 'debug',

//         onProxyReq: (proxyReq, req) => {
//             // 🔥 FIX: forward JSON body
//             if (req.body && Object.keys(req.body).length) {
//                 const bodyData = JSON.stringify(req.body);

//                 proxyReq.setHeader('Content-Type', 'application/json');
//                 proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
//                 proxyReq.write(bodyData);
//             }

//             console.log(`🔄 ${req.method} ${req.originalUrl} → ${target}`);
//         },

//         onError: (err, req, res) => {
//             console.error(`❌ Proxy error (${path}):`, err.message);
//             res.status(502).json({
//                 success: false,
//                 message: 'Service temporarily unavailable',
//             });
//         },
//     });
// };

// module.exports = (app) => {
//     app.use(
//         '/api/auth',
//         createProxy('/api/auth', `${process.env.AUTH_SERVICE_URL}/api/auth`)
//     );

//     app.use(
//         '/api/plans',
//         createProxy('/api/plans', `${process.env.BILLING_SERVICE_URL}/api/plans`)
//     );

//     app.use(
//         '/api/subscriptions',
//         createProxy(
//             '/api/subscriptions',
//             `${process.env.BILLING_SERVICE_URL}/api/subscriptions`
//         )
//     );

//     app.use(
//         '/api/webhooks',
//         createProxy(
//             '/api/webhooks',
//             `${process.env.BILLING_SERVICE_URL}/api/webhooks`
//         )
//     );

//     app.use(
//         '/api/usage',
//         createProxy('/api/usage', `${process.env.USAGE_SERVICE_URL}/api/usage`)
//     );

//     app.use(
//         '/api/admin',
//         createProxy('/api/admin', `${process.env.ADMIN_SERVICE_URL}/api/admin`)
//     );
// };


//LAST SUCCESSFULL ONE
// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = (app) => {
//     app.use(
//         '/api/auth',
//         createProxyMiddleware({
//             target: process.env.AUTH_SERVICE_URL,
//             changeOrigin: true,
//             pathRewrite: (path) => `/api/auth${path.replace('/api/auth', '')}`,
//         })
//     );

//     app.use(
//         '/api/plans',
//         createProxyMiddleware({
//             target: process.env.BILLING_SERVICE_URL,
//             changeOrigin: true,
//         })
//     );

//     app.use(
//         '/api/subscriptions',
//         createProxyMiddleware({
//             target: process.env.BILLING_SERVICE_URL,
//             changeOrigin: true,
//         })
//     );

//     app.use(
//         '/api/usage',
//         createProxyMiddleware({
//             target: process.env.USAGE_SERVICE_URL,
//             changeOrigin: true,
//         })
//     );

//     app.use(
//         '/api/admin',
//         createProxyMiddleware({
//             target: process.env.ADMIN_SERVICE_URL,
//             changeOrigin: true,
//         })
//     );
// };


const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        '/api/auth',
        createProxyMiddleware({
            target: process.env.AUTH_SERVICE_URL,
            changeOrigin: true,
            pathRewrite: (path) =>
                `/api/auth${path.replace('/api/auth', '')}`,
        })
    );

    app.use(
        '/api/plans',
        createProxyMiddleware({
            target: process.env.BILLING_SERVICE_URL,
            changeOrigin: true,
            pathRewrite: (path) =>
                `/api/plans${path.replace('/api/plans', '')}`,
        })
    );

    app.use(
        '/api/subscriptions',
        createProxyMiddleware({
            target: process.env.BILLING_SERVICE_URL,
            changeOrigin: true,
            pathRewrite: (path) =>
                `/api/subscriptions${path.replace('/api/subscriptions', '')}`,
        })
    );

    app.use(
        '/api/usage',
        createProxyMiddleware({
            target: process.env.USAGE_SERVICE_URL,
            changeOrigin: true,
            pathRewrite: (path) =>
                `/api/usage${path.replace('/api/usage', '')}`,
        })
    );

    app.use(
        '/api/admin',
        createProxyMiddleware({
            target: process.env.ADMIN_SERVICE_URL,
            changeOrigin: true,
            pathRewrite: (path) =>
                `/api/admin${path.replace('/api/admin', '')}`,
        })
    );
};
