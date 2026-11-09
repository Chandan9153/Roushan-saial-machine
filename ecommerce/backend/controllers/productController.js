const Category = require('../models/Category');
const Product = require('../models/Product');

function productFilter(query) {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.search) filter.$text = { $search: query.search };
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.featured === 'true') filter.featured = true;
  return filter;
}

async function listProducts(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 12, 50);
    const sortMap = { newest: { createdAt: -1 }, 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, name: { name: 1 } };
    const sort = sortMap[req.query.sort] || { createdAt: -1 };
    const filter = productFilter(req.query);
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sort).skip((page - 1) * limit).limit(limit),
      Product.countDocuments(filter),
    ]);
    return res.json({ success: true, data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { return next(err); }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data: product });
  } catch (err) { return next(err); }
}

async function createProduct(req, res, next) {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ success: false, message: 'Category not found' });
    if (req.files && req.files.length) req.body.images = req.files.map((f) => `/uploads/${f.filename}`);
    if (req.body.discountPrice != null && req.body.price != null && Number(req.body.discountPrice) >= Number(req.body.price)) {
      return res.status(400).json({ success: false, message: 'Discount price must be lower than the price' });
    }
    const product = await Product.create(req.body);
    return res.status(201).json({ success: true, data: product });
  } catch (err) { return next(err); }
}

async function updateProduct(req, res, next) {
  try {
    if (req.files && req.files.length) {
      const extra = req.files.map((f) => `/uploads/${f.filename}`);
      req.body.images = [...(Array.isArray(req.body.images) ? req.body.images : []), ...extra];
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data: product });
  } catch (err) { return next(err); }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, message: 'Product deleted' });
  } catch (err) { return next(err); }
}

async function relatedProducts(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4).populate('category', 'name slug');
    return res.json({ success: true, data: related });
  } catch (err) { return next(err); }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct, relatedProducts };
