const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    content: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  }
);

const contactModel = mongoose.model("contacts", contactSchema);
module.exports = contactModel;
