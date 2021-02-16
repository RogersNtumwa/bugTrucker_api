const Bug = require("../models/Bug");
const User = require("../models/User");
const appError = require("../utils/appError");
const cloudinary = require("../utils/cloudinary");

const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");
const { validationResult } = require("express-validator");
const apiFeatures = require("../utils/appFeatures");

// @desc GET all Bugs
// @route api/v1/bug
// @access private
exports.getBugs = asyncHandler(async (req, res) => {
  const resPerpage = 8;
  const bugCount = await Bug.countDocuments();
  const features = new apiFeatures(Bug.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .pagnation(resPerpage);

  const bugs = await features.query;

  res.status(200).send({
    status: "Success",
    count: bugCount,
    resPerpage,
    data: {
      bugs,
    },
  });
});

// @desc GET specific bug
// @route api/v1/bugs/bug_id
// @access private
exports.getBug = asyncHandler(async (req, res, next) => {
  const bug = await Bug.findById(req.params.id);
  if (!bug) {
    return next(new appError("The bug you are looking is not avaliabl", 404));
  }
  res.status(200).json({
    status: "Success",
    data: bug,
  });
});

// @desc POST new bug
// @route api/v1/bug
// @access private
exports.createbug = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  // checking for logged in user details
  const user = await User.findOne({ _id: req.user.id });

  if (user.role !== "developer" && user.role !== "tester") {
    return next(
      new appError("You don't have permission to execute this action", 401)
    );
  }

  // check if project exists by id
  let thisproject = await Project.findOne({ _id: req.body.project });
  if (!thisproject) {
    return next(
      new appError(" Sorry I can't find any project with the specified id", 400)
    );
  }
  // // check if asignedtoUser exists by id
  let asignedtoUser = await User.findOne({ _id: req.body.assignedTo });
  if (!asignedtoUser) {
    return next(
      new appError(" Sorry I can't find any user with the specified id", 400)
    );
  }

  let attachments = [];
  if (typeof req.body.attachments === "string") {
    attachments.push(req.body.attachments);
  } else {
    attachments = req.body.attachments;
  }

  let attachmentLinks = [];

  for (let i = 0; i < attachments.length; i++) {
    const result = await cloudinary.uploader.upload(attachments[i]);
    attachmentLinks.push({
      public_id: result.public_id,
      uri: result.secure_url,
    });
  }

  req.body.attachments = attachmentLinks;

  let bug = new Bug({
    title: req.body.title,
    project: req.body.project,
    category: req.body.category,
    priority: req.body.priority,
    description: req.body.description,
    assignedTo: req.body.assignedTo,
    attachments: req.body.attachments,
    createdBy: req.user.id,
  });
  await bug.save();

  res.status(201).json({
    status: "Succues",
    data: bug,
  });
});

// @desc   update Bug
// @route  patch /api/vi/bugs/:prod_id
// @access   private to only developers
exports.updateBug = asyncHandler(async (req, res, next) => {
  let getBug = await Bug.findById(req.params.id);
  if (!getBug) {
    return next(new appError("Bug doesn't not found", 404));
  } else {
    getBug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.json({
      status: "Success",
      data: {
        getBug,
      },
    });
  }
});

// @desc   delete bugs
// @route  delete /api/vi/bugs/:id
// @access   private to only teamLeaders
exports.deleteBug = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });
  if (user.role !== "Administrator") {
    return next(
      new appError("You don't have permission to execute this action", 401)
    );
  }

  // deleting actual project
  const bug = await Bug.findByIdAndRemove(req.params.id);
  if (!bug) {
    return next(
      new appError("The project with the given ID was not found.", 404)
    );
  }
  res.status(204);
});
