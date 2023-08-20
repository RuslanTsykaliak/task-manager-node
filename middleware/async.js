const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error('Caught error:', error); // Log the error for debugging
      next(error);
    }
  };
};

module.exports = asyncWrapper;
