const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controller/auth");
const { protect } = require("../middleware/auth");

router.route("/register").post(register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
