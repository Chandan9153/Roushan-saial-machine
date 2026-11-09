const express = require('express');
const { dashboard, listOrders, updateOrderStatus, listCustomers } = require('../controllers/adminController');
const { adminOnly } = require('../middleware/admin');
const { protect } = require('../middleware/auth');
const { validate } = require('../utils/validate');
const { objectIdParam } = require('../utils/validators');

const router = express.Router();

router.use(protect, adminOnly);
router.get('/dashboard', dashboard);
router.get('/orders', listOrders);
router.put('/orders/:id/status', objectIdParam(), validate, updateOrderStatus);
router.get('/customers', listCustomers);

module.exports = router;
