const Courses = require("../models/Course");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");

// @desc     Get all the courses
// router    GET api/v1/courses
//           GET api/v1/bootcamp/:bootcampId/courses
// access    public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Courses.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Courses.find();
  }

  const course = await query;
  res.status(200).json({
    success: true,
    count: course.length,
    data: course,
  });
});
