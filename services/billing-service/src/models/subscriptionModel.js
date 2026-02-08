const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan',
            required: true,
        },
        stripeCustomerId: {
            type: String,
            required: true,
        },
        stripeSubscriptionId: {
            type: String,
            required: function () {
                return this.status !== 'free';
            },
        },
        status: {
            type: String,
            enum: ['free', 'active', 'past_due', 'canceled', 'incomplete', 'trialing'],
            default: 'free',
        },
        currentPeriodStart: {
            type: Date,
        },
        currentPeriodEnd: {
            type: Date,
        },
        cancelAtPeriodEnd: {
            type: Boolean,
            default: false,
        },
        canceledAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
subscriptionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);