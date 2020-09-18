const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    services: { type: String },
    description: { type: String },
    image: { type: String, default: "user" },
    status: { type: String },
    commentId: { type: Number },
    BookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "bookings",
    },
    numberStar: { type: String },
  },
  {
    timestamps: true,
  }
);

const roomModel = mongoose.model("rooms", roomSchema);
module.exports = roomModel;
