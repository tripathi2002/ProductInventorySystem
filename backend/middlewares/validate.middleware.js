exports.validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(d => d.message)
      });
    }

    // Replace request data with validated & sanitized values
    req[property] = value;
    next();
  };
};
