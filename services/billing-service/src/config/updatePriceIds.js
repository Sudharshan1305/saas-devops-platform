const mongoose = require('mongoose');
const Plan = require('../models/planModel');
require('dotenv').config();

// PASTE YOUR ACTUAL STRIPE PRICE IDs HERE
const STRIPE_PRICE_IDS = {
    PRO: 'price_1SqYzIJHM3akeCYF6h2pK6WL',
    ENTERPRISE: 'price_1SqZ36JHM3akeCYF1BTo5rRR',
};

async function updatePriceIds() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Update PRO plan
        const proResult = await Plan.findOneAndUpdate(
            { name: 'PRO' },
            { stripePriceId: STRIPE_PRICE_IDS.PRO },
            { new: true }
        );
        console.log('✅ PRO plan updated:', proResult.stripePriceId);

        // Update ENTERPRISE plan
        const enterpriseResult = await Plan.findOneAndUpdate(
            { name: 'ENTERPRISE' },
            { stripePriceId: STRIPE_PRICE_IDS.ENTERPRISE },
            { new: true }
        );
        console.log('✅ ENTERPRISE plan updated:', enterpriseResult.stripePriceId);

        console.log('\n✅ All price IDs updated successfully!');

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error updating price IDs:', error);
        process.exit(1);
    }
}

updatePriceIds();