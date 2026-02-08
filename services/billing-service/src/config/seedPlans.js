const mongoose = require('mongoose');
const Plan = require('../models/planModel');
require('dotenv').config();

const plans = [
    {
        name: 'FREE',
        displayName: 'Free Plan',
        description: 'Perfect for trying out our platform',
        price: 0,
        currency: 'usd',
        interval: 'month',
        features: {
            apiCallsLimit: 1000,
            storageLimit: 1, // 1 GB
            supportLevel: 'community',
            customDomain: false,
            analyticsAccess: false,
        },
    },
    {
        name: 'PRO',
        displayName: 'Pro Plan',
        description: 'For professionals and small teams',
        price: 29,
        currency: 'usd',
        interval: 'month',
        stripePriceId: 'price_PLACEHOLDER', // We'll update this
        features: {
            apiCallsLimit: 50000,
            storageLimit: 50, // 50 GB
            supportLevel: 'email',
            customDomain: true,
            analyticsAccess: true,
        },
    },
    {
        name: 'ENTERPRISE',
        displayName: 'Enterprise Plan',
        description: 'For large organizations',
        price: 99,
        currency: 'usd',
        interval: 'month',
        stripePriceId: 'price_PLACEHOLDER', // We'll update this
        features: {
            apiCallsLimit: 1000000,
            storageLimit: 500, // 500 GB
            supportLevel: '24/7',
            customDomain: true,
            analyticsAccess: true,
        },
    },
];

async function seedPlans() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing plans
        await Plan.deleteMany({});
        console.log('🗑️  Cleared existing plans');

        // Insert new plans
        await Plan.insertMany(plans);
        console.log('✅ Plans seeded successfully');

        // Display plans
        const allPlans = await Plan.find({});
        console.log('\n📋 Available Plans:');
        allPlans.forEach(plan => {
            console.log(`\n${plan.displayName}:`);
            console.log(`  ID: ${plan._id}`);
            console.log(`  Price: $${plan.price}/${plan.interval}`);
            console.log(`  API Calls: ${plan.features.apiCallsLimit}`);
        });

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding plans:', error);
        process.exit(1);
    }
}

seedPlans();