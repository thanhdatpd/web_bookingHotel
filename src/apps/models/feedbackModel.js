const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    content: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  }
);

const feedbackModel = mongoose.model("feedbacks", feedbackSchema);
module.exports = feedbackModel;
