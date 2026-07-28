const express = require('express');
const router = express.Router();
const {getAllProducts,getProductById,createProduct} = require('../controllers/productController');
const {requireAuth, requireAdmin} = require('../middleware/authMiddleware');

router.get('/',getAllProducts);
router.get('/:id',getProductById);
router.post('/',requireAuth,requireAdmin,createProduct);
module.exports = router;