const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", unique: true },
    size: { type: Number, default: 30 },
    price: { type: String, default: 300000 },
    type: {
      type: String,
      enum: ["single", "double", "vip"],
      default: "single",
    },
    services: { type: String, default: "Wifi, Television, Bathroom,..." },
    description: { type: String, default: "" },
    image: { type: String, default: "default.jpeg" },
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
        type: Number,
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
