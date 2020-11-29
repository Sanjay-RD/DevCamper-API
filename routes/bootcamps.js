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

const { protect, authorize } = require("../middleware/auth");

// include Other resource router
const courseRouter = require("./courses");

// Re-router into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResult(bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamps);

// route for file upload
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamps)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamps);

module.exports = router;
