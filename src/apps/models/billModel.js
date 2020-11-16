const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
    billServicesId: [{ type: mongoose.Schema.Types.ObjectId, ref: "billServices" }],
  },
  {
    timestamps: true,
  }
);

const billModel = mongoose.model("bills", billSchema);
module.exports = billModel;
