import mongoose from 'mongoose';

const walletTopupSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String, index: true, unique: true, sparse: true },
  transactionId: { type: String },
  providerResponse: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

const WalletTopup = mongoose.model('WalletTopup', walletTopupSchema);
export default WalletTopup;
