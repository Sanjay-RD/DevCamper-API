const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc      Get all Bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
// exports.getBootcamps = async (req, res, next) => {
//   // res.status(200).json({ success: true, msg: "Show all bootcamps" });
//   try {
//     const bootcamp = await Bootcamp.find();

//     res.status(200).json({
//       success: true,
//       count: bootcamp.length,
//       data: bootcamp,
//     });
//   } catch (error) {
//     // res.status(400).json({
//     //   success: false,
//     // });
//     next(error);
//   }
// };

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // res.status(200).json({ success: true, msg: "Show all bootcamps" });
  const bootcamp = await Bootcamp.find();

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});

// @desc      Get single Bootcamps
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  // res
  //   .status(200)
  //   .json({ success: true, msg: `Show bootcamp ${req.params.id} ` });
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new errorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Create new Bootcamps
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamps = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  // res.status(200).json({ success: true, msg: `Create new bootcamp` });
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Get update Bootcamps
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamps = asyncHandler(async (req, res, next) => {
  // res
  //   .status(200)
  //   .json({ success: true, msg: `Update bootcamps ${req.params.id}` });
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new errorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      DELETE Bootcamps
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
  // res
  //   .status(200)
  //   .json({ success: true, msg: `Delete bootcamps of ${req.params.id}` });
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});
