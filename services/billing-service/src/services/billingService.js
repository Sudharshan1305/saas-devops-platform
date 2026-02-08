const Plan = require('../models/planModel');
const Subscription = require('../models/subscriptionModel');
const stripeService = require('./stripeService');

class BillingService {
    // Get all available plans
    async getAllPlans() {
        const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
        return plans;
    }

    // Get a specific plan
    async getPlanById(planId) {
        const plan = await Plan.findById(planId);
        if (!plan) {
            throw new Error('Plan not found');
        }
        return plan;
    }

    // Get user's current subscription
    async getUserSubscription(userId) {
        const subscription = await Subscription.findOne({ userId })
            .populate('planId')
            .sort({ createdAt: -1 });

        return subscription;
    }

    // Create a new subscription
    async createSubscription(userId, userEmail, userName, planId) {
        // Get the plan
        const plan = await this.getPlanById(planId);

        // Check if user already has an active subscription
        const existingSubscription = await Subscription.findOne({
            userId,
            status: { $in: ['active', 'trialing'] },
        });

        if (existingSubscription) {
            throw new Error('User already has an active subscription');
        }

        // Create or get Stripe customer
        let stripeCustomer;
        const existingSub = await Subscription.findOne({ userId });

        if (existingSub && existingSub.stripeCustomerId) {
            stripeCustomer = { id: existingSub.stripeCustomerId };
        } else {
            stripeCustomer = await stripeService.createCustomer(userEmail, userName);
        }

        let subscription;

        // Handle FREE plan
        if (plan.name === 'FREE') {
            subscription = await Subscription.create({
                userId,
                planId: plan._id,
                stripeCustomerId: stripeCustomer.id,
                status: 'free',
            });

            return {
                subscription,
                requiresPayment: false,
            };
        }

        // Handle paid plans
        const stripeSubscription = await stripeService.createSubscription(
            stripeCustomer.id,
            plan.stripePriceId
        );

        subscription = await Subscription.create({
            userId,
            planId: plan._id,
            stripeCustomerId: stripeCustomer.id,
            stripeSubscriptionId: stripeSubscription.id,
            status: stripeSubscription.status,
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        });

        return {
            subscription: await subscription.populate('planId'),
            clientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret,
            requiresPayment: true,
        };
    }

    // Create checkout session (alternative to direct subscription)
    async createCheckoutSession(userId, userEmail, userName, planId, successUrl, cancelUrl) {
        const plan = await this.getPlanById(planId);

        if (plan.name === 'FREE') {
            throw new Error('Cannot create checkout session for free plan');
        }

        // Get or create Stripe customer
        let stripeCustomer;
        const existingSub = await Subscription.findOne({ userId });

        if (existingSub && existingSub.stripeCustomerId) {
            stripeCustomer = { id: existingSub.stripeCustomerId };
        } else {
            stripeCustomer = await stripeService.createCustomer(userEmail, userName);
        }

        const session = await stripeService.createCheckoutSession(
            stripeCustomer.id,
            plan.stripePriceId,
            successUrl,
            cancelUrl
        );

        return {
            sessionId: session.id,
            url: session.url,
        };
    }

    // Cancel subscription
    async cancelSubscription(userId) {
        const subscription = await Subscription.findOne({
            userId,
            status: { $in: ['active', 'trialing'] },
        });

        if (!subscription) {
            throw new Error('No active subscription found');
        }

        if (subscription.status === 'free') {
            throw new Error('Cannot cancel free plan');
        }

        await stripeService.cancelSubscription(subscription.stripeSubscriptionId, true);

        subscription.cancelAtPeriodEnd = true;
        await subscription.save();

        return await subscription.populate('planId');
    }

    // Reactivate subscription
    async reactivateSubscription(userId) {
        const subscription = await Subscription.findOne({
            userId,
            cancelAtPeriodEnd: true,
        });

        if (!subscription) {
            throw new Error('No canceled subscription found');
        }

        await stripeService.reactivateSubscription(subscription.stripeSubscriptionId);

        subscription.cancelAtPeriodEnd = false;
        await subscription.save();

        return await subscription.populate('planId');
    }

    // Update subscription (upgrade/downgrade)
    async updateSubscription(userId, newPlanId) {
        const subscription = await Subscription.findOne({
            userId,
            status: { $in: ['active', 'trialing'] },
        });

        if (!subscription) {
            throw new Error('No active subscription found');
        }

        const newPlan = await this.getPlanById(newPlanId);

        if (newPlan.name === 'FREE') {
            // Downgrade to free - cancel current subscription
            await this.cancelSubscription(userId);

            const freeSubscription = await Subscription.create({
                userId,
                planId: newPlan._id,
                stripeCustomerId: subscription.stripeCustomerId,
                status: 'free',
            });

            return await freeSubscription.populate('planId');
        }

        // Update to new paid plan
        await stripeService.updateSubscription(
            subscription.stripeSubscriptionId,
            newPlan.stripePriceId
        );

        subscription.planId = newPlan._id;
        await subscription.save();

        return await subscription.populate('planId');
    }
}

module.exports = new BillingService();