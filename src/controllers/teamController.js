const Team = require("../models/Team");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const appError = require("../utils/appError");
const { validationResult } = require("express-validator");

// @desc   get all teams
// @route  GET /api/vi/team
// @access   private
exports.getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find();
  res.status(200).json({
    status: "success",
    data: teams,
  });
});
// @desc   create new team
// @route  POST /api/vi/teams
// @access   private to onlyy teamLeaders
// exports.createTeam = asyncHandler(async (req, res, next) => {
// checking for logged in user details
// const user = await User.findOne({ _id: req.user.id });

// if (user.role !== "developer") {
//   return next(
//     new appError("You don't have permission to execute this action", 401)
//   );
// }
exports.createTeam = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { teamName } = req.body;
  let team = await Team.findOne({ teamName });
  if (team) {
    return next(new appError("team already exists", 400));
  }
  team = await Team.create({
    teamName,
  });

  res.status(201).json({
    status: "Succues",
    data: team,
  });
});

// @desc   get team by id
// @route  POST /api/vi/teams/id
// @access   private
exports.getTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    return next(new appError("There is no team with the specified id", 404));
  }
  res.status(200).json({
    status: "Success",
    data: team,
  });
});

// @desc   get team members
// @route  POST /api/vi/teams/id
// @access   private

exports.getTeamMembers = asyncHandler(async (req, res, next) => {
  const members = await User.find({ team: req.params.id });
  if (!members) {
    return next(appError("The provided team has no members yet", 200));
  }
  res.status(200).json({
    status: "success",
    data: members,
  });
});

// @desc   update team
// @route  patch /api/vi/teams/:id
// @access   private to onlyy teamLeaders
exports.updateTeam = asyncHandler(async (req, res, next) => {
  //   const user = await User.findOne({ _id: req.user.id });

  //   if (user.role !== "team leader") {
  //     return next(
  //       new appError("You don't have permission to execute this action", 401)
  //     );
  //   }
  const getTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.send({
    status: "Success",
    data: {
      getTeam,
    },
  });
});

// @desc   delete team and coresponding users
// @route  delete /api/vi/teams/:id
// @access   private to onlyy teamLeaders
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  // const user = await User.findOne({ _id: req.user.id });
  // if (user.role !== "team leader") {
  //   return next(
  //     new appError("You don't have permission to execute this action", 401)
  //   );
  // }
  const users = await User.findOneAndRemove({ team: req.params.id });

  const team = await Team.findByIdAndRemove(req.params.id);
  if (!team) {
    return next(new appError("The team with the given ID was not found.", 404));
  }
  res.status(200).send({
    status: "success",
    data: {},
  });
});
