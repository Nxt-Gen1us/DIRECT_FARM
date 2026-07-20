import logger from '../utils/logger.js';

const errorHandler = (err, req, res, _next) => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });

  const statusCode = err.statusCode || 500;
  const response = {
    status: 'error',
    message: err.message || 'Internal server error'
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
