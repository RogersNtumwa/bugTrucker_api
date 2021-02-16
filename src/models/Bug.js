const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: true,
  },
  description: { type: String, required: true, minlength: 10 },
  status: {
    type: String,
    required: true,
    enum: ["New", "Coding", "In-Review", "Branded", "Rejected", "closed"],
    default: "New",
  },
  priority: {
    type: String,
    required: [true, "Please select priority"],
    enum: ["High", "Medium", "Low"],
    default: "Low",
  },

  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please enter a team"],
  },
  category: { type: String, enum: ["bug", "enhancement", "ticket"] },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please select developer"],
  },
  attachments: [
    {
      public_id: {
        type: String,
        required: true,
      },
      uri: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Bug = mongoose.model("Bug", bugSchema);
module.exports = Bug;
