const { Order, ORDER_STATUSES } = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

async function dashboard(req, res, next) {
  try {
    const [totalOrders, totalProducts, totalCustomers, revenue] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);
    const ordersByStatus = await Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]);
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name phone');
    return res.json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalCustomers,
        revenue: revenue[0]?.total || 0,
        ordersByStatus: Object.fromEntries(ordersByStatus.map((s) => [s._id, s.count])),
        recentOrders,
      },
    });
  } catch (err) { return next(err); }
}

async function listOrders(req, res, next) {
  try {
    const filter = req.query.status ? { orderStatus: req.query.status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('user', 'name email phone');
    return res.json({ success: true, data: orders });
  } catch (err) { return next(err); }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { orderStatus } = req.body;
    if (!ORDER_STATUSES.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: `Order status must be one of: ${ORDER_STATUSES.join(', ')}` });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.json({ success: true, data: order });
  } catch (err) { return next(err); }
}

async function listCustomers(req, res, next) {
  try {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    return res.json({ success: true, data: customers });
  } catch (err) { return next(err); }
}

module.exports = { dashboard, listOrders, updateOrderStatus, listCustomers };
