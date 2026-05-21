const mongoose = require("mongoose");

const interviewSchema =
  new mongoose.Schema({

    userId: {
      type: String,
    },

    category: {
      type: String,
    },

    score: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Pending",
    },

    feedback: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

  });

module.exports =
  mongoose.model(
    "Interview",
    interviewSchema
  );