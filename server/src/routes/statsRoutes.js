const express = require('express');
const router = express.Router();
const {getStats,getMonthlyStatement,downloadMonthlyStatement} = require('../controllers/statsController');
const {requireAuth, requireAdmin} = require('../middleware/authMiddleware');

router.get('/', requireAuth,requireAdmin,getStats);
router.get('/monthly', requireAuth, requireAdmin, getMonthlyStatement);
router.get('/monthly/download', requireAuth, requireAdmin, downloadMonthlyStatement);

module.exports = router;