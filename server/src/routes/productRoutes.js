const express = require('express');
const router = express.Router();
const {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct} = require('../controllers/productController');
const {requireAuth, requireAdmin} = require('../middleware/authMiddleware');

router.get('/',getAllProducts);
router.get('/:id',getProductById);
router.post('/',requireAuth,requireAdmin,createProduct);
router.put('/:id',requireAuth,requireAdmin,updateProduct);
router.delete('/:id',requireAuth,requireAdmin,deleteProduct);
module.exports = router;