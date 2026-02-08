// const Stripe = require('stripe');

// // Initialize Stripe with secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//     apiVersion: '2023-10-16',
// });

// module.exports = stripe;

const Stripe = require('stripe');

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

// Debug: Check if key is loaded (remove this after testing)
if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('STRIPE')));
}

module.exports = stripe;