const User = require("../models/User");
const appError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

// @desc   Get all users
// @route  GET /api/vi/auth/users
// @access   private/Admin

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ status: "success", data: users });
});

// @desc   Get a single user
// @route  GET /api/vi/auth/users/:id
// @access   private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new appError(`User not found`, 404));
  }
  res.status(200).send({
    status: "success",
    data: user,
  });
});

// @desc   update a user
// @route   PUT/api/vi/auth/users/:id
// @access   private/Admin
exports.updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new appError(`No user found with id ${req.params.id}`, 404));
  }
  res.status(200).send({
    status: "success",
    data: user,
  });
};

// @desc   delete a user
// @route   DELETE/api/vi/auth/users/:id
// @access   private/Admin
exports.deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return next(new appError(`No user found with id ${req.params.id}`, 404));
  res.status(200).send({
    status: "success",
    data: {},
  });
};
