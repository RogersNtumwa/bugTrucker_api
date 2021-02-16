const Project = require("../models/Project");
const appError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const Bug = require("../models/Bug");
const { validationResult } = require("express-validator");

// @desc GET all projects
// @route api/v1/projects
// @access private
exports.getProjects = asyncHandler(async (req, res) => {
  const allProjects = await Project.find();
  res.status(200).json({
    status: "success",
    data: allProjects,
  });
});

// @desc GET specific project
// @route api/v1/projects/prod_id
// @access private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(
      new appError("The project you are looking is not avaliabl", 404)
    );
  }
  res.status(200).json({
    status: "Success",
    data: project,
  });
});

// @desc POST new project
// @route api/v1/projects
// @access private
exports.createProject = asyncHandler(async (req, res, next) => {
  // // checking for logged in user details

  // const user = await User.findOne({ _id: req.user.id });

  // if (user.role !== "developer") {
  //   return next(
  //     new appError("You don't have permission to execute this action", 401)
  //   );
  // }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  let project = await Project.findOne({ title });
  if (project) {
    return next(new appError("Project already exists", 400));
  }
  project = await Project.create({
    title,
    description,
  });

  res.status(201).json({
    status: "Succues",
    data: project,
  });
});

// @desc   update Project
// @route  patch /api/vi/projects/:prod_id
// @access   private to only teamLeaders
exports.updateProject = asyncHandler(async (req, res, next) => {
  //   const user = await User.findOne({ _id: req.user.id });

  //   if (user.role !== "developer") {
  //     return next(
  //       new appError("You don't have permission to execute this action", 401)
  //     );
  //   }
  const getProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.send({
    status: "Success",
    data: {
      getProject,
    },
  });
});

// @desc   delete team and coresponding bugs
// @route  delete /api/vi/projects/:id
// @access   private to only teamLeaders

exports.deleteProject = asyncHandler(async (req, res, next) => {
  // const user = await User.findOne({ _id: req.user.id });
  // if (user.role !== "team leader") {
  //   return next(
  //     new appError("You don't have permission to execute this action", 401)
  //   );
  // }
  // deleting related bugs and tickets
  const bugs = await Bug.findOneAndRemove({ team: req.params.id });

  // deleteing actual project
  const project = await Project.findByIdAndRemove(req.params.id);
  if (!project) {
    return next(
      new appError("The project with the given ID was not found.", 404)
    );
  }
  res.status(200).send({
    status: "success",
    data: {},
  });
});
