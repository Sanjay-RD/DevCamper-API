const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  public
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  sendTokenResponse(user, 200, res);
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
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new errorResponse("Invalid Credentials", 401));
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new errorResponse("Invalid Credentaials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    get current logged in user
// @route   GET /api/v1/auth/me
// @access  private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    forget password
// @route   POST /api/v1/auth/forgetpassword
// @access  public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new errorResponse("There is no user with this email address", 404)
    );
  }

  const resetToken = user.getResetPasswordToken();

  console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model ,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
