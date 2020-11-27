const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, default: "" },
    fullName: { type: String, default: "" },
    password: { type: String, default: "" },
    role: { type: String, default: "user" },
    avatar: { type: String, default: "avatar.jpg" },
    phoneNumber: { type: Number },
    gender: { type: String,enum: ["male","female"] ,default: "male" },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
