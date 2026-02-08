/**
 * @swagger
 * /api/plans:
 *   get:
 *     tags: [Billing]
 *     summary: Get all subscription plans
 *     responses:
 *       200:
 *         description: List of plans retrieved successfully
 */

/**
 * @swagger
 * /api/subscriptions/my-subscription:
 *   get:
 *     tags: [Billing]
 *     summary: Get current user subscription
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription retrieved
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/subscriptions/subscribe:
 *   post:
 *     tags: [Billing]
 *     summary: Subscribe to a plan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *                 example: 696b59eca309c2e0127eb630
 *     responses:
 *       201:
 *         description: Subscription created
 *       400:
 *         description: Invalid request
 */