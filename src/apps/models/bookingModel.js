const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    startAt: { type: Date, default: new Date() },
    endAt: { type: Date, default: new Date()  },
    roomId: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "rooms",
    }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    status: {
      type: String,
      enum: ["wait_confirm", "wait_check_in", "check_in", "fail", "success"],
      default: "wait_confirm",
      required: true,
    },
    numberCustomer: {
      type: String,
      enum: ["two", "three"],
      default: "two",
    },
  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.model("bookings", bookingSchema);
module.exports = bookingModel;
