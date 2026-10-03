import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProfile', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ author: 1 });
reviewSchema.index({ farmer: 1 });
reviewSchema.index({ product: 1 });
reviewSchema.index({ author: 1, product: 1 }, { unique: true, partialFilterExpression: { product: { $exists: true } } });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
