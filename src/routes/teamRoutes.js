const express = require("express");
const router = express.Router();

const {
  getTeam,
  getTeamMembers,
  getTeams,
  updateTeam,
  deleteTeam,
  createTeam,
} = require("../controllers/teamController");

router.route("/").get(getTeams).post(createTeam);

router.route("/:id").get(getTeam).patch(updateTeam).delete(deleteTeam);

module.exports = router;
