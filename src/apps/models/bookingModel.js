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
// bookingModel.create({
//   // startAt: "2020-11-03T09:00:00Z",
//   // endAt: "2020-11-04T09:00:00Z",

//   roomId: "5f9b8759b0965a122cf55c69",
//   userId: "5f9b8387842db8238897f0e0",
// });

module.exports = bookingModel;
