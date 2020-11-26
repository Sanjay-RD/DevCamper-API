const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  public
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  // create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});

// @desc    login user
// @route   POST /api/v1/auth/login
// @access  public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(new errorResponse("Please provide an email and password", 400));
  }

  // check for user
  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new errorResponse("Invalid Credentials", 401));
  }

  // check if password matches
  const isMatch = user.matchPassword(password);

  if (!isMatch) {
    return next(new errorResponse("Invalid Credentaials", 401));
  }

  // create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});
