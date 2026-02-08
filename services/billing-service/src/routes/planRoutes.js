const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/auth');

// Get all available plans (public)
router.get('/', subscriptionController.getAllPlans);

module.exports = router;