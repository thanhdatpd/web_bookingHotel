const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: { type: String },
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    roomId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'rooms'},
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model("comments", commentSchema);
module.exports = commentModel;
