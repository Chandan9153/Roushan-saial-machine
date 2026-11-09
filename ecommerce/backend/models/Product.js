const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema(
  { key: { type: String, required: true, trim: true }, value: { type: String, required: true, trim: true } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 200 },
    description: { type: String, required: [true, 'Product description is required'], trim: true, maxlength: 2000 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] },
    // Null price = Price on enquiry (confirmed in shop). Never invent a price.
    price: { type: Number, min: 0, default: null },
    discountPrice: { type: Number, min: 0, default: null },
    // True only for the 8 assumed sample prices, until the owner confirms real prices.
    isSamplePrice: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    stock: { type: Number, min: 0, default: 0 },
    specifications: { type: [specificationSchema], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
