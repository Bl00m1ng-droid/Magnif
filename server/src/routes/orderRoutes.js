const express = require('express');
const router = express.Router();
const {createOrder,getMyOrders,getAllOrders,updateDeliveryStatus} = require('../controllers/orderController');
const {requireAuth,requireAdmin} = require('../middleware/authMiddleware');

router.post('/', requireAuth, createOrder);
router.get('/my-orders', requireAuth, getMyOrders); 
router.get('/all',requireAuth, requireAdmin, getAllOrders);
router.patch('/:id/delivery-status',requireAuth, requireAdmin, updateDeliveryStatus);
{/**patch - meand update just one field ,where put- means replace the whole resource */}
module.exports = router;