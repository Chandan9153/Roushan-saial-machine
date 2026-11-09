const { body, param, query } = require('express-validator');

const objectIdParam = (name = 'id') => param(name).isMongoId().withMessage(`${name} must be a valid id`);

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian mobile number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('category').isMongoId().withMessage('Category must be a valid id'),
  body('price').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Price must be 0 or more'),
  body('discountPrice').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Discount price must be 0 or more'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be 0 or more'),
];

const categoryRules = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug').trim().notEmpty().withMessage('Category slug is required'),
];

const orderRules = [
  body('products').isArray({ min: 1 }).withMessage('Order must contain at least one product'),
  body('products.*.product').isMongoId().withMessage('Each product must be a valid id'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Customer name is required'),
  body('shippingAddress.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit mobile number is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Full address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.pinCode').matches(/^\d{6}$/).withMessage('PIN code must be 6 digits'),
  body('paymentMethod').isIn(['COD', 'WhatsApp']).withMessage('Payment method must be COD or WhatsApp'),
];

const productQuery = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
];

module.exports = { objectIdParam, registerRules, loginRules, productRules, categoryRules, orderRules, productQuery };
