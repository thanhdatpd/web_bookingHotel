const mongoose = require("mongoose");

require("../apps/models/userModel");


const uris = "mongodb://localhost:27017/db_bookingHotel";

mongoose.connect(uris);
