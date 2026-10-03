import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' }
}, { _id: false });

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProfile', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String },
  category: { type: String, index: true },
  price: { type: Number, required: true },
  quantityAvailable: { type: Number, default: 0 },
  images: [mediaSchema],
  video: mediaSchema,
  shelfLifeDays: { type: Number },
  packaging: { type: String },
  harvestDate: { type: Date },
  freshnessScore: { type: Number, default: 0 },
  isOrganic: { type: Boolean, default: false },
  variety: { type: String },
  unit: { type: String, default: 'kg' },
  minQty: { type: Number, default: 1 },
  tags: [{ type: String }],
  origin: { type: String },
  passportId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ name: 'text', category: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ farmer: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
