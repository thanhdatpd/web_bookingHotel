const mongoose = require("mongoose");
require("../apps/models/userModel");
const uris = "mongodb://localhost:27017/db_bookingHotel";
try {
  mongoose.connect(uris, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
} catch (error) {
  handleError(error);
}
