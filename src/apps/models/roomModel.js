const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    size: { type: String, default: "" },
    type: { type: String, enum: ["single", "double", "vip"], default: "single" },
    services: { type: String, default: "Wifi, Television, Bathroom,..." },
    description: { type: String, default: "" },
    image: { type: String, default: "avatar.jpg" },
    status: { type: String, enum: ["empty", "ordered"], default: "empty" },
    commentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    bookingId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookings",
      },
    ],
    rating: [
      {
        type: String,
        ref: "bookings",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const roomModel = mongoose.model("rooms", roomSchema);
module.exports = roomModel;
