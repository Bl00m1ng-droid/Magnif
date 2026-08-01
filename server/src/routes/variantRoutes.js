const express = require('express');
const router = express.Router();
const {updateVariant, deleteVariant} = require('../controllers/variantController');
const {requireAuth, requireAdmin} = require('../middleware/authMiddleware');

router.put('/:id',requireAuth, requireAdmin, updateVariant); //only authenticated admins can update a variant
router.delete('/:id',requireAuth, requireAdmin, deleteVariant); //only authenticated admins can delete a variant]

module.exports = router;