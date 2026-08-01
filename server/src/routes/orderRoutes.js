const express = require('express');
const router = express.Router();
const {createOrder,getMyOrders} = require('../controllers/orderController');
const {requireAuth} = require('../middleware/authMiddleware');

router.post('/', requireAuth, createOrder);
router.get('/my-orders', requireAuth, getMyOrders); 

module.exports = router;