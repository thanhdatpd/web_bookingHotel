const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "rooms" },
    servicesId: { type: mongoose.Schema.Types.ObjectId, ref: "services" },
  },
  {
    timestamps: true,
  }
);

const billModel = mongoose.model("bills", billSchema);
module.exports = billModel;
