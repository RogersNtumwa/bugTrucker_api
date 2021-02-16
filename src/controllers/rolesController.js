const { validationResult } = require("express-validator");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const Role = require("../models/Roles");
const appError = require("../utils/appError");

// @desc   get all roles
// @route  GET /api/vi/roles
// @access   private
exports.getRoles = asyncHandler(async (req, res, next) => {
  const roles = await Role.find();
  res.status(200).json({
    status: "success",
    data: roles,
  });
});

// @desc   get specific role
// @route  GET /api/vi/roles/role_id
// @access   private
exports.getRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    return next(new appError("There is no role with the specified id", 404));
  }
  res.status(200).json({
    status: "Success",
    data: role,
  });
});

// @desc   create new role
// @route  POST /api/vi/roles
// @access   private to onlyy admin
// exports.createTeam = asyncHandler(async (req, res, next) => {
// checking for logged in user details
// const user = await User.findOne({ _id: req.user.id });

// if (user.role !== "developer") {
//   return next(
//     new appError("You don't have permission to execute this action", 401)
//   );
// }
exports.createRole = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title } = req.body;
  let role = await Role.findOne({ title });
  if (role) {
    return next(new appError("Role already exists", 400));
  }
  role = await Role.create({
    title,
  });

  res.status(201).json({
    status: "Succues",
    data: role,
  });
});

// @desc   update role
// @route  patch /api/vi/roles/:id
// @access   private to onlyy admin
exports.updateRole = asyncHandler(async (req, res, next) => {
  //   const user = await User.findOne({ _id: req.user.id });

  //   if (user.role !== "team leader") {
  //     return next(
  //       new appError("You don't have permission to execute this action", 401)
  //     );
  //   }
  const getRole = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.send({
    status: "Success",
    data: {
      getRole,
    },
  });
});

// @desc like apost
// route patch /api/v1/post/like/:id
// acess private
exports.addRole = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title } = req.body;
  const user = await User.findById(req.params.id);
  const roletoasign = await Role.findOne({ title });
  if (!roletoasign) {
    return next(new appError("There is no such role", 404));
  } else {
    user.roles.unshift({ title: roletoasign });
    await user.save();

    res.status(201).json({
      status: "Seccuss",
      data: user.roles,
    });
  }
});
//  @desc unlike apost
// route patch /api/v1/post/unlike/:id
// acess private
exports.removeRole = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // Check if user is already has this role by the current user
  if (
    user.likes.filter((like) => like.user.toString() === req.user.id).length ===
    0
  ) {
    return next(new appError("User doesn't have this role yet", 400));
  }

  const removeIndex = user.likes
    .map((like) => like.user.toString())
    .indexOf(req.user.id);

  user.likes.splice(removeIndex, 1);
  await user.save();
  res.json(user.likes);
});
