const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    startAt: { type: Date, default: new Date() },
    endAt: { type: Date, default: new Date() },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "rooms",
    },
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
      enum: ["two","three"],
       default: "two"
    },
  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.model("bookings", bookingSchema);
bookingModel.create({
  roomId: "5f8ea5191a475c0e600aa48d",
  userId: "5f8eac3295b08c175c64b8a5",
});
module.exports = bookingModel;
