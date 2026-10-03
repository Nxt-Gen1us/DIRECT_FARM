import HarvestTimeline from '../models/harvestTimeline.model.js';

class HarvestTimelineRepository {
  async create(data) {
    return HarvestTimeline.create(data);
  }

  async findById(id) {
    return HarvestTimeline.findById(id).populate('farmer', 'farmName location');
  }

  async findByFarmer(farmerId, options = {}) {
    const { limit = 20, cropName } = options;
    const filter = { farmer: farmerId };
    if (cropName) filter.cropName = new RegExp(cropName, 'i');
    return HarvestTimeline.find(filter)
      .sort({ expectedHarvestAt: 1, createdAt: -1 })
      .limit(Number(limit));
  }

  async findUpcoming(daysAhead = 30) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + daysAhead);
    
    return HarvestTimeline.find({
      expectedHarvestAt: { $gte: now, $lte: future }
    })
      .populate('farmer', 'farmName location')
      .sort({ expectedHarvestAt: 1 })
      .limit(50);
  }

  async updateById(id, data) {
    return HarvestTimeline.findByIdAndUpdate(id, data, { new: true }).populate('farmer', 'farmName location');
  }

  async deleteById(id) {
    return HarvestTimeline.findByIdAndDelete(id);
  }

  async addEvent(id, event) {
    return HarvestTimeline.findByIdAndUpdate(
      id,
      { $push: { events: event } },
      { new: true }
    ).populate('farmer', 'farmName location');
  }
}

export default new HarvestTimelineRepository();
