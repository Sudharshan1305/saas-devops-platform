const stripe = require('../config/stripe');

class StripeService {
    // Create a Stripe customer
    async createCustomer(email, name) {
        try {
            const customer = await stripe.customers.create({
                email,
                name,
                metadata: {
                    source: 'saas-platform',
                },
            });
            return customer;
        } catch (error) {
            console.error('Stripe create customer error:', error);
            throw new Error('Failed to create customer in Stripe');
        }
    }

    // Create a subscription
    async createSubscription(customerId, priceId) {
        try {
            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                payment_behavior: 'default_incomplete',
                payment_settings: { save_default_payment_method: 'on_subscription' },
                expand: ['latest_invoice.payment_intent'],
            });
            return subscription;
        } catch (error) {
            console.error('Stripe create subscription error:', error);
            throw new Error('Failed to create subscription in Stripe');
        }
    }

    // Cancel a subscription
    async cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
        try {
            const subscription = await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: cancelAtPeriodEnd,
            });
            return subscription;
        } catch (error) {
            console.error('Stripe cancel subscription error:', error);
            throw new Error('Failed to cancel subscription');
        }
    }

    // Reactivate a canceled subscription
    async reactivateSubscription(subscriptionId) {
        try {
            const subscription = await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: false,
            });
            return subscription;
        } catch (error) {
            console.error('Stripe reactivate subscription error:', error);
            throw new Error('Failed to reactivate subscription');
        }
    }

    // Update subscription (upgrade/downgrade)
    async updateSubscription(subscriptionId, newPriceId) {
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
                items: [
                    {
                        id: subscription.items.data[0].id,
                        price: newPriceId,
                    },
                ],
                proration_behavior: 'create_prorations',
            });

            return updatedSubscription;
        } catch (error) {
            console.error('Stripe update subscription error:', error);
            throw new Error('Failed to update subscription');
        }
    }

    // Get customer's payment methods
    async getPaymentMethods(customerId) {
        try {
            const paymentMethods = await stripe.paymentMethods.list({
                customer: customerId,
                type: 'card',
            });
            return paymentMethods.data;
        } catch (error) {
            console.error('Stripe get payment methods error:', error);
            throw new Error('Failed to get payment methods');
        }
    }

    // Create a Checkout Session (for hosted payment page)
    async createCheckoutSession(customerId, priceId, successUrl, cancelUrl) {
        try {
            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: successUrl,
                cancel_url: cancelUrl,
            });
            return session;
        } catch (error) {
            console.error('Stripe create checkout session error:', error);
            throw new Error('Failed to create checkout session');
        }
    }

    // Construct webhook event
    constructWebhookEvent(payload, signature) {
        try {
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
            return event;
        } catch (error) {
            console.error('Webhook signature verification failed:', error.message);
            throw new Error('Webhook signature verification failed');
        }
    }
}

module.exports = new StripeService();