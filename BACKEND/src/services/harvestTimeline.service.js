import harvestTimelineRepository from '../repositories/harvestTimeline.repository.js';
import FarmerProfile from '../models/farmerProfile.model.js';

function timelineError(message, statusCode) {
  return Object.assign(new Error(message), { statusCode });
}

class HarvestTimelineService {
  async createTimeline(userId, data) {
    const { farmerId, cropName, plantedAt, expectedHarvestAt, events } = data;

    // Validate farmer profile exists and belongs to user (if not admin)
    const farmer = await FarmerProfile.findById(farmerId);
    if (!farmer) throw timelineError('Farmer profile not found', 404);

    const timeline = await harvestTimelineRepository.create({
      farmer: farmerId,
      cropName,
      plantedAt: plantedAt ? new Date(plantedAt) : undefined,
      expectedHarvestAt: expectedHarvestAt ? new Date(expectedHarvestAt) : undefined,
      events: events || [],
    });

    return harvestTimelineRepository.findById(timeline._id);
  }

  async getTimelineById(id) {
    const timeline = await harvestTimelineRepository.findById(id);
    if (!timeline) throw timelineError('Harvest timeline not found', 404);
    return timeline;
  }

  async getFarmerTimelines(farmerId, options) {
    const farmer = await FarmerProfile.findById(farmerId);
    if (!farmer) throw timelineError('Farmer profile not found', 404);
    return harvestTimelineRepository.findByFarmer(farmerId, options);
  }

  async getUpcomingHarvests(daysAhead = 30) {
    return harvestTimelineRepository.findUpcoming(daysAhead);
  }

  async updateTimeline(id, userId, userRole, data) {
    const timeline = await harvestTimelineRepository.findById(id);
    if (!timeline) throw timelineError('Harvest timeline not found', 404);

    // Check authorization: must be the farmer's owner or admin
    const farmer = await FarmerProfile.findById(timeline.farmer);
    if (farmer.user.toString() !== userId && userRole !== 'admin') {
      throw timelineError('Not authorized to update this timeline', 403);
    }

    const updateData = {};
    if (data.cropName !== undefined) updateData.cropName = data.cropName;
    if (data.plantedAt !== undefined) updateData.plantedAt = new Date(data.plantedAt);
    if (data.expectedHarvestAt !== undefined) updateData.expectedHarvestAt = new Date(data.expectedHarvestAt);
    if (data.events !== undefined) updateData.events = data.events;

    return harvestTimelineRepository.updateById(id, updateData);
  }

  async addTimelineEvent(id, userId, userRole, event) {
    const timeline = await harvestTimelineRepository.findById(id);
    if (!timeline) throw timelineError('Harvest timeline not found', 404);

    // Check authorization
    const farmer = await FarmerProfile.findById(timeline.farmer);
    if (farmer.user.toString() !== userId && userRole !== 'admin') {
      throw timelineError('Not authorized to update this timeline', 403);
    }

    const eventData = {
      eventType: event.eventType,
      title: event.title,
      description: event.description || '',
      occurredAt: event.occurredAt ? new Date(event.occurredAt) : new Date(),
    };

    return harvestTimelineRepository.addEvent(id, eventData);
  }

  async deleteTimeline(id, userId, userRole) {
    const timeline = await harvestTimelineRepository.findById(id);
    if (!timeline) throw timelineError('Harvest timeline not found', 404);

    // Check authorization
    const farmer = await FarmerProfile.findById(timeline.farmer);
    if (farmer.user.toString() !== userId && userRole !== 'admin') {
      throw timelineError('Not authorized to delete this timeline', 403);
    }

    await harvestTimelineRepository.deleteById(id);
    return { message: 'Harvest timeline deleted successfully' };
  }
}

export default new HarvestTimelineService();
