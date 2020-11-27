const asyncHandler = require("./async");
const errorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Protect route
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make user token exit
  if (!token) {
    return next(new errorResponse("Not Authorized to access this route", 401));
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new errorResponse("Not Authorized to access this route", 401));
  }
});
