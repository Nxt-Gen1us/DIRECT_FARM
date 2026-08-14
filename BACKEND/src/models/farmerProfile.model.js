import mongoose from 'mongoose';

const farmGallerySchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' }
}, { _id: false });

const farmerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  farmName: { type: String, required: true, trim: true },
  description: { type: String },
  location: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' }
    }
  },
  organicCertification: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  trustedBadge: { type: Boolean, default: false },
  experienceYears: { type: Number, default: 0 },
  gallery: [farmGallerySchema],
  farmStory: { type: String },
  lastHarvestAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

farmerProfileSchema.index({ farmName: 1 });
farmerProfileSchema.index({ 'location.coordinates': '2dsphere' });

const FarmerProfile = mongoose.model('FarmerProfile', farmerProfileSchema);
export default FarmerProfile;
