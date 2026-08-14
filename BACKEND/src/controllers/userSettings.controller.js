import userService from '../services/user.service.js';

export const updateSettings = async (req, res, next) => {
  try {
    const user = await userService.updatePreferences(req.user.id, req.body);
    res.status(200).json({ status: 'success', data: user.preferences });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    await userService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};
