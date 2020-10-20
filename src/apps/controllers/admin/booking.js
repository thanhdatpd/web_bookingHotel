const mongoose = require("mongoose");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const bookingModel = require("../../models/bookingModel");
const moment = require("moment");
const joi = require("joi");

//get services
exports.bookings = async (req, res, next) => {
  const page = parseInt(req.query.page || 1);
  const limit = 2;

  const skip = (page - 1) * limit;

  const totalDocuments = await bookingModel.find().countDocuments();

  const totalPages = Math.ceil(totalDocuments / limit);
  const range = [];
  const rangerForDot = [];
  const detal = 1;

  const left = page - detal;
  const right = page + detal;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      range.push(i);
    }
  }

  let temp;
  range.map((i) => {
    if (temp) {
      if (i - temp === 2) {
        rangerForDot.push(i - 1);
      } else if (i - temp !== 1) {
        rangerForDot.push("...");
      }
    }
    temp = i;
    rangerForDot.push(i);
  });

  const bookings = await bookingModel
    .find({})
    .sort("-_id")
    .limit(limit)
    .skip(skip);
  // var data = moment("bookings.startAt", "DD-MM-YYYY HH:mm:ss");
  // console.log("exports.bookings -> data", data)
  // bookings.startAt = 
  res.render("admin/pages/bookings/index", {
    bookings,
    range: rangerForDot,
    page,
    totalPages,
  });
};
