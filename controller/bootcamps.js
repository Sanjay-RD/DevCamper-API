const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const path = require("path");

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

  res.status(200).json(res.advancedResult);
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
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  bootcamp.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Upload photo for Bootcamps
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new errorResponse(`Please upload a file`, 400));
  }

  // console.log(req.files);
  const file = req.files.file;

  // make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new errorResponse("Please upload a image file", 400));
  }

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new errorResponse(
        `please uplaod a image less than ${process.env.MAX_FILE_UPLOAD}`
      )
    );
  }

  // console.log(path.parse(file.name));

  // create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new errorResponse("Problem with file upload", 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// @desc      get all Bootcamps with in redius
// @route     GET api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // get lat/lng from goecoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  // cal radius using radians
  // divide distance by radius of earth
  // Earth radius = 3963 mi /6378 km
  const radius = distance / 3963;
  const bootcamp = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});
