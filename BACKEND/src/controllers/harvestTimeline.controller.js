import harvestTimelineService from '../services/harvestTimeline.service.js';

export const createTimeline = async (req, res, next) => {
  try {
    const timeline = await harvestTimelineService.createTimeline(req.user.userId, req.body);
    res.status(201).json({ status: 'success', data: timeline });
  } catch (error) {
    next(error);
  }
};

export const getTimeline = async (req, res, next) => {
  try {
    const timeline = await harvestTimelineService.getTimelineById(req.params.id);
    res.json({ status: 'success', data: timeline });
  } catch (error) {
    next(error);
  }
};

export const getFarmerTimelines = async (req, res, next) => {
  try {
    const timelines = await harvestTimelineService.getFarmerTimelines(req.params.farmerId, {
      cropName: req.query.cropName,
      limit: req.query.limit,
    });
    res.json({ status: 'success', data: timelines });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingHarvests = async (req, res, next) => {
  try {
    const timelines = await harvestTimelineService.getUpcomingHarvests(req.query.days);
    res.json({ status: 'success', data: timelines });
  } catch (error) {
    next(error);
  }
};

export const updateTimeline = async (req, res, next) => {
  try {
    const timeline = await harvestTimelineService.updateTimeline(
      req.params.id,
      req.user.userId,
      req.user.role,
      req.body
    );
    res.json({ status: 'success', data: timeline });
  } catch (error) {
    next(error);
  }
};

export const addTimelineEvent = async (req, res, next) => {
  try {
    const timeline = await harvestTimelineService.addTimelineEvent(
      req.params.id,
      req.user.userId,
      req.user.role,
      req.body
    );
    res.json({ status: 'success', data: timeline });
  } catch (error) {
    next(error);
  }
};

export const deleteTimeline = async (req, res, next) => {
  try {
    const result = await harvestTimelineService.deleteTimeline(
      req.params.id,
      req.user.userId,
      req.user.role
    );
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};
