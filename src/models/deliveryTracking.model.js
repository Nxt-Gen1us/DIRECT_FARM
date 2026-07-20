import mongoose from 'mongoose';

const trackingEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  recordedAt: { type: Date, default: Date.now }
}, { _id: false });

const deliveryTrackingSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  courier: { type: String },
  trackingNumber: { type: String, index: true },
  currentStatus: { type: String, enum: ['pending', 'picked', 'in_transit', 'delivered', 'delayed', 'returned'], default: 'pending' },
  estimatedDelivery: { type: Date },
  route: [{ type: String }],
  events: [trackingEventSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const DeliveryTracking = mongoose.model('DeliveryTracking', deliveryTrackingSchema);
export default DeliveryTracking;
