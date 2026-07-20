import farmerProfileService from '../services/farmerProfile.service.js';

export const getFarmerProfile = async (req, res, next) => {
  try {
    const profile = await farmerProfileService.getByUser(req.user.id);
    res.status(200).json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateFarmerProfile = async (req, res, next) => {
  try {
    const profile = await farmerProfileService.updateByUser(req.user.id, req.body);
    res.status(200).json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
};

export const createFarmerProfile = async (req, res, next) => {
  try {
    const profile = await farmerProfileService.createProfile({ user: req.user.id, ...req.body });
    res.status(201).json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
};
