import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String },
  channel: { type: String, enum: ['email', 'sms', 'push', 'in-app'], default: 'in-app' },
  metadata: { type: mongoose.Schema.Types.Mixed },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ readAt: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
