const mongoose = require("mongoose");

const testS = new mongoose.Schema({
  startAt: { type: Date, default: new Date() },
  endAt: { type: Date, default: new Date() },
  roomId: { type: String, default: "1" },
});

const testModel = mongoose.model("test", testS);

module.exports = testModel;
