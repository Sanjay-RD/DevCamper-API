const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc      Get all user
// @route     GET /api/v1/auth/user
// @access    private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

// @desc      Get single user
// @route     GET /api/v1/auth/user/:id
// @access    private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      create user
// @route     POST /api/v1/auth/user
// @access    private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user
// @route     PUT /api/v1/auth/user/:id
// @access    private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/user/:id
// @access    private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
