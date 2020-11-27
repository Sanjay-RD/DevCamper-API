const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controller/courses");

const courses = require("../models/Course");
const advancedResult = require("../middleware/advancedResult");

const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResult(courses, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
