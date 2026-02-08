const stripeService = require('../services/stripeService');
const Subscription = require('../models/subscriptionModel');

// POST /api/webhooks/stripe
exports.handleStripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];

    let event;

    try {
        // Verify webhook signature
        event = stripeService.constructWebhookEvent(req.body, signature);
    } catch (error) {
        console.error('Webhook signature verification failed:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log(`📨 Webhook received: ${event.type}`);

    try {
        // Handle different event types
        switch (event.type) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;

            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error.message);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
};

// Helper functions for webhook events

async function handleSubscriptionCreated(subscription) {
    console.log('✅ Subscription created:', subscription.id);

    await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        { new: true }
    );
}

async function handleSubscriptionUpdated(subscription) {
    console.log('🔄 Subscription updated:', subscription.id);

    await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
        { new: true }
    );
}

async function handleSubscriptionDeleted(subscription) {
    console.log('❌ Subscription deleted:', subscription.id);

    await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        {
            status: 'canceled',
            canceledAt: new Date(),
        },
        { new: true }
    );
}

async function handlePaymentSucceeded(invoice) {
    console.log('💰 Payment succeeded for invoice:', invoice.id);

    if (invoice.subscription) {
        await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: invoice.subscription },
            {
                status: 'active',
            },
            { new: true }
        );
    }
}

async function handlePaymentFailed(invoice) {
    console.log('⚠️ Payment failed for invoice:', invoice.id);

    if (invoice.subscription) {
        await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: invoice.subscription },
            {
                status: 'past_due',
            },
            { new: true }
        );
    }
}