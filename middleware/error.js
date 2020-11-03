const ErrorResponse = require("../utils/errorResponse");

const handleError = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // log to console for dev
  console.log(err.stack.red);

  // console.log(err.name);
  // Mongoose bad object id
  if (err.name === "CastError") {
    const message = `Bootcamp not found with the id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || `Server Error`,
  });
};

module.exports = handleError;
