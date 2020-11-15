const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

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
  let query;

  let reqQuery = { ...req.query };

  let removeField = ["select", "sort", "limit", "page"];

  removeField.forEach((param) => delete reqQuery[param]);

  // console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));

  if (req.query.select) {
    let field = req.query.select.split(",").join(" ");
    query = query.select(field);
  }

  if (req.query.sort) {
    const field = req.query.sort.split(",").join(" ");
    query = query.sort(field);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  // console.log(typeof page);
  // console.log(typeof limit);
  // console.log(`start index = ${startIndex}`);
  // console.log(`end index = ${endIndex}`);
  // console.log(`total = ${total}`);

  query = query.skip(startIndex).limit(limit);

  // executing query
  const bootcamp = await query;

  // create pagination object
  pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    pagination,
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
