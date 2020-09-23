const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "rooms" },
    services: [{
      
    }],
    price:{type:Number , default: 100000}
  },
  {
    timestamps: true,
  }
);

const servicesModel = mongoose.model("services", servicesSchema);
module.exports = servicesModel;
