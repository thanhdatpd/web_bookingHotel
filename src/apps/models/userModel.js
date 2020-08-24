const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String},
  fullName: { type: String },
  password: { type: String },
  role: { type: String, default: "user" },
  avatar: { type: String, default: "" },
  phoneNumber: { type: Number},
  gender: { type: String, default: "male" }, 
},
  {
    timestamps: true,
  });

mongoose.model("users", userSchema);
