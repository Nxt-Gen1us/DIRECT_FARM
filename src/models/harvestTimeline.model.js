import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  occurredAt: { type: Date, required: true }
}, { _id: false });

const harvestTimelineSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProfile', required: true },
  cropName: { type: String, required: true },
  plantedAt: { type: Date },
  expectedHarvestAt: { type: Date },
  events: [eventSchema],
  createdAt: { type: Date, default: Date.now }
});

harvestTimelineSchema.index({ farmer: 1, cropName: 1 });

const HarvestTimeline = mongoose.model('HarvestTimeline', harvestTimelineSchema);
export default HarvestTimeline;
