const Product = require('../models/Product');
const { Order } = require('../models/Order');
const { buildWhatsAppOrderMessage, whatsappLink } = require('../services/whatsapp');

async function createOrder(req, res, next) {
  try {
    const { products, shippingAddress, paymentMethod } = req.body;
    const ids = products.map((p) => p.product);
    const found = await Product.find({ _id: { $in: ids } });
    if (found.length !== ids.length) return res.status(400).json({ success: false, message: 'One or more products were not found' });
    const byId = Object.fromEntries(found.map((p) => [String(p._id), p]));
    const items = products.map((p) => {
      const product = byId[String(p.product)];
      return { product: product._id, name: product.name, price: product.price, quantity: p.quantity };
    });
    // Price-on-enquiry items have price null and contribute 0 here; the shop confirms their price.
    const totalAmount = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
    const whatsappMessage = buildWhatsAppOrderMessage({ items, totalAmount, shippingAddress, paymentMethod });
    const order = await Order.create({
      user: req.user._id, products: items, shippingAddress, paymentMethod, totalAmount, whatsappMessage,
    });
    return res.status(201).json({
      success: true,
      data: order,
      whatsappUrl: whatsappLink(whatsappMessage),
    });
  } catch (err) { return next(err); }
}

async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('products.product', 'name images');
    return res.json({ success: true, data: orders });
  } catch (err) { return next(err); }
}

async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('products.product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only view your own orders' });
    }
    return res.json({ success: true, data: order });
  } catch (err) { return next(err); }
}

module.exports = { createOrder, myOrders, getOrder };
