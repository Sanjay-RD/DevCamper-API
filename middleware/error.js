const ErrorResponse = require("../utils/errorResponse");

const handleError = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // log to console for dev
  console.log(err.stack.red);

  // console.log(err);
  // Mongoose bad object id
  if (err.name === "CastError") {
    const message = `Bootcamp not found with the id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value enter";
    error = new ErrorResponse(message, 400);
  }

  // mongoose validator error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || `Server Error`,
  });
};

module.exports = handleError;
