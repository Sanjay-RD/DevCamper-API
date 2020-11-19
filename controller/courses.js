const Courses = require("../models/Course");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Get all the courses
// router    GET api/v1/courses
//           GET api/v1/bootcamp/:bootcampId/courses
// access    public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Courses.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Courses.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const course = await query;
  res.status(200).json({
    success: true,
    count: course.length,
    data: course,
  });
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
      new ErrorResponse(`No course with the id of ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});
