const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true},
  fullName: { type: String },
  password: { type: String },
  role: { type: String, default: "user" },
  avatar: { type: String, default: "assets/images/uploads/users/avatar.jpg" },
  phoneNumber: { type: Number},
  gender: { type: String, default: "male" }, 
},
  {
    timestamps: true,
  });

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
