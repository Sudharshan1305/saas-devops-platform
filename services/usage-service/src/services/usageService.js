const Usage = require('../models/usageModel');
const { getRedis, setRedis, incrRedis, expireRedis } = require('../config/redis');
const axios = require('axios');

class UsageService {
    // Track a new API call
    async trackUsage(userId, endpoint, method, statusCode, responseTime, metadata = {}) {
        try {
            // Save to MongoDB for historical records
            const usage = await Usage.create({
                userId,
                endpoint,
                method,
                statusCode,
                responseTime,
                metadata,
            });

            // Increment counter in Redis (for current month)
            const monthKey = this.getMonthlyUsageKey(userId);
            await incrRedis(monthKey);

            // Set expiry to end of next month to be safe
            const daysUntilEndOfNextMonth = this.getDaysUntilEndOfNextMonth();
            await expireRedis(monthKey, daysUntilEndOfNextMonth * 24 * 60 * 60);

            return usage;
        } catch (error) {
            console.error('Track usage error:', error);
            throw error;
        }
    }

    // Get current month usage count
    async getMonthlyUsage(userId) {
        const monthKey = this.getMonthlyUsageKey(userId);
        const count = await getRedis(monthKey);
        return parseInt(count || '0');
    }

    // Check if user has exceeded their limit
    async checkUsageLimit(userId) {
        try {
            // Get user's current usage
            const currentUsage = await this.getMonthlyUsage(userId);

            // Get user's plan limit from billing service
            const planLimit = await this.getUserPlanLimit(userId);

            const remaining = Math.max(0, planLimit - currentUsage);
            const percentage = planLimit > 0 ? (currentUsage / planLimit) * 100 : 0;

            return {
                current: currentUsage,
                limit: planLimit,
                remaining,
                percentage: Math.min(100, percentage.toFixed(2)),
                exceeded: currentUsage >= planLimit,
            };
        } catch (error) {
            console.error('Check usage limit error:', error);
            // If we can't check, allow the request (fail open)
            return {
                current: 0,
                limit: 1000,
                remaining: 1000,
                percentage: 0,
                exceeded: false,
            };
        }
    }

    // Get user's plan limit from billing service
    async getUserPlanLimit(userId) {
        try {
            // Cache the plan limit in Redis for 1 hour
            const cacheKey = `user:${userId}:plan-limit`;
            const cached = await getRedis(cacheKey);

            if (cached) {
                return parseInt(cached);
            }

            // Fetch from billing service
            const response = await axios.get(
                `${process.env.BILLING_SERVICE_URL}/api/subscriptions/my-subscription`,
                {
                    headers: {
                        'x-user-id': userId, // Internal service-to-service call
                    },
                }
            );

            const subscription = response.data.data;
            const limit = subscription?.planId?.features?.apiCallsLimit || 1000;

            // Cache for 1 hour
            await setRedis(cacheKey, limit.toString(), { EX: 3600 });

            return limit;
        } catch (error) {
            console.error('Get user plan limit error:', error);
            // Default to free tier limit if we can't fetch
            return 1000;
        }
    }

    // Get usage statistics for a user
    async getUserStats(userId, startDate, endDate) {
        const query = {
            userId,
            timestamp: {
                $gte: startDate,
                $lte: endDate,
            },
        };

        const [totalCalls, successCalls, errorCalls, avgResponseTime] = await Promise.all([
            Usage.countDocuments(query),
            Usage.countDocuments({ ...query, statusCode: { $lt: 400 } }),
            Usage.countDocuments({ ...query, statusCode: { $gte: 400 } }),
            Usage.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: null,
                        avgTime: { $avg: '$responseTime' },
                    },
                },
            ]),
        ]);

        // Get top endpoints
        const topEndpoints = await Usage.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$endpoint',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        return {
            totalCalls,
            successCalls,
            errorCalls,
            successRate: totalCalls > 0 ? ((successCalls / totalCalls) * 100).toFixed(2) : 0,
            avgResponseTime: avgResponseTime[0]?.avgTime?.toFixed(2) || 0,
            topEndpoints: topEndpoints.map(e => ({
                endpoint: e._id,
                count: e.count,
            })),
        };
    }

    // Helper: Get Redis key for monthly usage
    getMonthlyUsageKey(userId) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `usage:${userId}:${year}-${month}`;
    }

    // Helper: Calculate days until end of next month
    getDaysUntilEndOfNextMonth() {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        const diffTime = nextMonth - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

module.exports = new UsageService();