const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "bookings" },
    billServicesId: 
    {
      type: mongoose.Schema.Types.ObjectId, ref: "billServices",
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

const billModel = mongoose.model("bills", billSchema);

module.exports = billModel;
