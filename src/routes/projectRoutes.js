const express = require("express");
const router = express.Router();

const {
  getProject,
  getProjects,
  updateProject,
  deleteProject,
  createProject,
} = require("../controllers/projectController");

router.route("/")
    .get(getProjects)
    .post(createProject);

router.route("/:id")
    .get(getProject)
    .patch(updateProject)
    .delete(deleteProject);

module.exports = router;
