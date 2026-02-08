const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        endpoint: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            required: true,
        },
        statusCode: {
            type: Number,
            required: true,
        },
        responseTime: {
            type: Number, // in milliseconds
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient queries
usageSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Usage', usageSchema);