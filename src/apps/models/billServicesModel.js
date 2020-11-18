const mongoose = require("mongoose");

const billServicesSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "bookings" },
    servicesId: [
      {
        servicesId: { type: mongoose.Schema.Types.ObjectId, ref: "services" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 100000 },
      },
    ],
    status: {
      type: String,
      enum: ["wait_confirm", "ordered"],
      default: "ordered",
    },
    price: {
      type: Number,
      default: 100000,
    },
  },
  {
    timestamps: true,
  }
);
const billServicesModel = mongoose.model("billServices", billServicesSchema);
module.exports = billServicesModel;
