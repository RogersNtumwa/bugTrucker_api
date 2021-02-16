const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  getRole,
  getRoles,
  createRole,
  updateRole,
  addRole,
  removeRole,
} = require("../controllers/rolesController");

router.route("/").get(getRoles).post(check("title", "Title is required").not().isEmpty(),
  createRole);
router.route("/:id").get(getRole).patch(updateRole);


module.exports = router;
