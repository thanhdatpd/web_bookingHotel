const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "rooms" },
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model("comments", commentSchema);
module.exports = commentModel;
