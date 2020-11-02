const Bootcamp = require("../models/Bootcamp");

// @desc      Get all Bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = async (req, res, next) => {
  // res.status(200).json({ success: true, msg: "Show all bootcamps" });
  try {
    const bootcamp = await Bootcamp.find();
    res.status(200).json({
      success: true,
      count: bootcamp.length,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

// @desc      Get single Bootcamps
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = async (req, res, next) => {
  // res
  //   .status(200)
  //   .json({ success: true, msg: `Show bootcamp ${req.params.id} ` });

  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    // res.status(400).json({
    //   success: false,
    // });
    next(error);
  }
};

// @desc      Create new Bootcamps
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamps = async (req, res, next) => {
  // console.log(req.body);
  // res.status(200).json({ success: true, msg: `Create new bootcamp` });
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

// @desc      Get update Bootcamps
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamps = async (req, res, next) => {
  // res
  //   .status(200)
  //   .json({ success: true, msg: `Update bootcamps ${req.params.id}` });

  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

// @desc      DELETE Bootcamps
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamps = async (req, res, next) => {
  // res
  //   .status(200)
  //   .json({ success: true, msg: `Delete bootcamps of ${req.params.id}` });

  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};
