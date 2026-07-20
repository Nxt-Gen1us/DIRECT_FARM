import authService from '../services/auth.service.js';

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      const error = new Error('Refresh token required');
      error.statusCode = 400;
      throw error;
    }

    const tokens = await authService.rotateRefreshToken(refreshToken);
    res.status(200).json({ status: 'success', data: tokens });
  } catch (error) {
    next(error);
  }
};
