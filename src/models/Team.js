const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  users: { type: mongoose.Schema.ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
