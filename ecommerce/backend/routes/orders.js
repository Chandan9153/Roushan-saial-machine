const express = require('express');
const { createOrder, myOrders, getOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { validate } = require('../utils/validate');
const { objectIdParam, orderRules } = require('../utils/validators');

const router = express.Router();

router.post('/', protect, orderRules, validate, createOrder);
router.get('/my-orders', protect, myOrders);
router.get('/:id', protect, objectIdParam(), validate, getOrder);

module.exports = router;
