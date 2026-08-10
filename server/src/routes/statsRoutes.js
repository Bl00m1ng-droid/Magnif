const express = require('express');
const router = express.Router();
const {getStats} = require('../controllers/statsController');
const {requireAuth, requireAdmin} = require('../middleware/authMiddleware');

router.get('/', requireAuth,requireAdmin,getStats);

module.exports = router;