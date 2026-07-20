import mongoose from 'mongoose';

const aiPredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProfile' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  type: { type: String, enum: ['disease', 'grade', 'price', 'demand', 'description'], required: true },
  inputData: { type: mongoose.Schema.Types.Mixed },
  result: { type: mongoose.Schema.Types.Mixed },
  confidence: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

aiPredictionSchema.index({ user: 1, farmer: 1, product: 1, type: 1 });

const AiPrediction = mongoose.model('AiPrediction', aiPredictionSchema);
export default AiPrediction;
