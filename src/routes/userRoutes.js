const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { addRole}= require("../controllers/rolesController")

router.route("/").get(getUsers);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser)
router.route("/roles/:id").patch(addRole);

module.exports = router;
