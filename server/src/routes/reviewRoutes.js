const express = require('express');
const router = express.Router();
const {createReview} = require('../controllers/reviewController');
const {requireAuth} = require('../middleware/authMiddleware');

router.post('/', requireAuth, createReview);

module.exports = router;