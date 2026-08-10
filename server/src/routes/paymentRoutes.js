const express = require('express');
const router = express.Router();
const { initiatePayment, checkPaymentStatus } = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/initiate/:orderId', requireAuth, initiatePayment);
router.get('/status/:orderId', requireAuth, checkPaymentStatus);

module.exports = router;