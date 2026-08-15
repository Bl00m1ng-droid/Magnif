const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', requireAuth, requireAdmin, getAllUsers);
router.patch('/:id/role', requireAuth, requireAdmin, updateUserRole);

module.exports = router;