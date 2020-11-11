const mongoose = require("mongoose");

const billServicesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    servicesId: [{ type: mongoose.Schema.Types.ObjectId, ref: "services" }],
    quantity: { type: Number, default: 1 },
    status: { type: String, enum:["wait_confirm","ordered"] },  
  },
  {
    timestamps: true,
  }
);

const billServicesModel = mongoose.model("billServices", billServicesSchema);
module.exports = billServicesModel;
