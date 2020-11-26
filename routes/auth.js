const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/auth");

router.route("/register").post(register);
router.post("/login", login);

module.exports = router;
