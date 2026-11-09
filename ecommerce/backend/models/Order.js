const mongoose = require('mongoose');

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    // Null for Price-on-enquiry items; such items are confirmed by the shop, not charged here.
    price: { type: Number, min: 0, default: null },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: 'Jharkhand', trim: true },
    pinCode: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: { type: [orderItemSchema], required: true, validate: [(v) => v.length > 0, 'Order must contain at least one product'] },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: { type: String, enum: ['COD', 'WhatsApp'], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    orderStatus: { type: String, enum: ORDER_STATUSES, default: 'Pending' },
    whatsappMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = { Order: mongoose.model('Order', orderSchema), ORDER_STATUSES };
