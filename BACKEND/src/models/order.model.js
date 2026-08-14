import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProfile', required: true },
  items: [orderItemSchema],
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'], default: 'pending' },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  deliveryAddress: {
    label: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  invoiceUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.index({ customer: 1 });
orderSchema.index({ farmer: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
