const express = require('express');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct, relatedProducts } = require('../controllers/productController');
const { adminOnly } = require('../middleware/admin');
const { protect } = require('../middleware/auth');
const { upload } = require('../services/upload');
const { validate } = require('../utils/validate');
const { objectIdParam, productQuery, productRules } = require('../utils/validators');

const router = express.Router();

router.get('/', productQuery, validate, listProducts);
router.get('/:id', objectIdParam(), validate, getProduct);
router.get('/:id/related', objectIdParam(), validate, relatedProducts);
router.post('/', protect, adminOnly, upload.array('images', 5), productRules, validate, createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), objectIdParam(), validate, updateProduct);
router.delete('/:id', protect, adminOnly, objectIdParam(), validate, deleteProduct);

module.exports = router;
