const express = require("express");
const router = express.Router();

const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamps,
  bootcampPhotoUpload,
  getBootcampsInRadius,
} = require("../controller/bootcamps");

const bootcamp = require("../models/Bootcamp");
const advancedResult = require("../middleware/advancedResult");

// include Other resource router
const courseRouter = require("./courses");

// Re-router into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResult(bootcamp, "courses"), getBootcamps)
  .post(createBootcamps);

// route for file upload
router.route("/:id/photo").put(bootcampPhotoUpload);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamps)
  .delete(deleteBootcamps);

module.exports = router;
