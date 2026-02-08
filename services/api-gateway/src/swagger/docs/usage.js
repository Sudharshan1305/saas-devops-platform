/**
 * @swagger
 * /api/usage/limits:
 *   get:
 *     tags: [Usage]
 *     summary: Check usage limits
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usage limits retrieved
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/usage/stats:
 *   get:
 *     tags: [Usage]
 *     summary: Get usage statistics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics
 *     responses:
 *       200:
 *         description: Statistics retrieved
 */