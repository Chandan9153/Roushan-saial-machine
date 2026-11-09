const Category = require('../models/Category');
const Product = require('../models/Product');

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const countById = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
    const data = categories.map((c) => ({ ...c.toObject(), productCount: countById[String(c._id)] || 0 }));
    return res.json({ success: true, data });
  } catch (err) { return next(err); }
}

async function createCategory(req, res, next) {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json({ success: true, data: category });
  } catch (err) { return next(err); }
}

async function updateCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, data: category });
  } catch (err) { return next(err); }
}

async function deleteCategory(req, res, next) {
  try {
    const inUse = await Product.countDocuments({ category: req.params.id });
    if (inUse > 0) return res.status(400).json({ success: false, message: `Category is used by ${inUse} product(s). Move or delete those products first.` });
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err) { return next(err); }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
