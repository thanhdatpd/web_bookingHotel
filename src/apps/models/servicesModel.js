const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "rooms" },
    services: [],
    price:{type:String}
  },
  {
    timestamps: true,
  }
);

const servicesModel = mongoose.model("services", servicesSchema);
module.exports = servicesModel;
