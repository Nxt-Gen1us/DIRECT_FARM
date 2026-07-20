import userService from '../services/user.service.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const user = await userService.addAddress(req.user.id, req.body);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

export const removeAddress = async (req, res, next) => {
  try {
    const user = await userService.removeAddress(req.user.id, req.params.addressId);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};
