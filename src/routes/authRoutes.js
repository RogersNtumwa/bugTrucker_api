const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/auth");
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { check } = require("express-validator");

router.route("/register").post([
    check("firstName", "Firstname is required").not().isEmpty(),
    check("lastName", "Lastname is required").not().isEmpty(),
    check("password", "password is required").not().isEmpty(),

],registerUser);
router.route("/").post(loginUser);
router.route("/me").get(protect,getMe);

module.exports = router;
