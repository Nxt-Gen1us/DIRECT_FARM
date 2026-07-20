const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

export default validateRequest;
