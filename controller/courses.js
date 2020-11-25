const Courses = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");

// @desc     Get all the courses
// router    GET api/v1/courses
//           GET api/v1/bootcamp/:bootcampId/courses
// access    public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const course = Courses.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: course.length,
      data: course,
    });
  } else {
    res.status(200).json(res.advancedResult);
  }
});

// @desc     Get single courses
// router    GET api/v1/courses/:id
// access    public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new errorResponse(`No course with the id of ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     Add courses
// router    POST api/v1/bootcamp/:bootcampId/course
// access    private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new errorResponse(`No bootcamp with the id of ${req.params.id}`, 400)
    );
  }

  const course = await Courses.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     Update courses
// router    PUT api/v1/course/:id
// access    private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return next(
      new errorResponse(`No course with the id of ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     Delete courses
// router    delete api/v1/course/:id
// access    private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Courses.findById(req.params.id);

  if (!course) {
    return next(
      new errorResponse(`No course with the id of ${req.params.id}`, 400)
    );
  }

  course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
