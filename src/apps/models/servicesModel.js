const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    price: { type: Number, default: 100000 },
  },
  {
    timestamps: true,
  }
);

const servicesModel = mongoose.model("services", servicesSchema);
module.exports = servicesModel;
