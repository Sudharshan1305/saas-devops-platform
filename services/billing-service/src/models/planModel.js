const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            enum: ['FREE', 'PRO', 'ENTERPRISE'],
        },
        displayName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'usd',
        },
        interval: {
            type: String,
            enum: ['month', 'year'],
            required: true,
        },
        stripePriceId: {
            type: String,
            required: function () {
                return this.price > 0; // Only required for paid plans
            },
        },
        features: {
            apiCallsLimit: {
                type: Number,
                required: true,
            },
            storageLimit: {
                type: Number, // in GB
                required: true,
            },
            supportLevel: {
                type: String,
                enum: ['community', 'email', 'priority', '24/7'],
                default: 'community',
            },
            customDomain: {
                type: Boolean,
                default: false,
            },
            analyticsAccess: {
                type: Boolean,
                default: false,
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Plan', planSchema);