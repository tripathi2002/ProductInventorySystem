const errorHandler = (err, req, res, next) => {
  console.error("Error ---> ", err);
  const statusCode = err.status ? err.status : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };
