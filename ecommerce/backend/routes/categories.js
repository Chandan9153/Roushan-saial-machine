const express = require('express');
const { listCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { adminOnly } = require('../middleware/admin');
const { protect } = require('../middleware/auth');
const { validate } = require('../utils/validate');
const { categoryRules, objectIdParam } = require('../utils/validators');

const router = express.Router();

router.get('/', listCategories);
router.post('/', protect, adminOnly, categoryRules, validate, createCategory);
router.put('/:id', protect, adminOnly, objectIdParam(), categoryRules, validate, updateCategory);
router.delete('/:id', protect, adminOnly, objectIdParam(), validate, deleteCategory);

module.exports = router;
