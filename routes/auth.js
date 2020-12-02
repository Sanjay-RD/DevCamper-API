const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgetPassword,
  resetPassword,
} = require("../controller/auth");
const { protect } = require("../middleware/auth");

router.route("/register").post(register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgetpassword", forgetPassword);
router.put("/forgetpassword/:resettoken", resetPassword);

module.exports = router;
