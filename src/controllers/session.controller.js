import userRepository from '../repositories/user.repository.js';

export const listSessions = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    res.status(200).json({ status: 'success', data: user.sessions || [] });
  } catch (error) {
    next(error);
  }
};

export const revokeSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      const error = new Error('Refresh token required');
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.removeSession(req.user.id, refreshToken);
    res.status(200).json({ status: 'success', data: user.sessions });
  } catch (error) {
    next(error);
  }
};

export const revokeAllSessions = async (req, res, next) => {
  try {
    const user = await userRepository.updateById(req.user.id, { sessions: [] });
    res.status(200).json({ status: 'success', data: user.sessions });
  } catch (error) {
    next(error);
  }
};
