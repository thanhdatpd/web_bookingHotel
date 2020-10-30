const mongoose = require("mongoose");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const pagination = require("./../../../libs/pagination");
const bookingModel = require("../../models/bookingModel");
const moment = require("moment");
const joi = require("joi");

//get bookings
exports.bookings = async (req, res, next) => {
  const {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.booking(req);

  const bookings = await bookingModel

    .find({})
    .populate("userId")
    .populate("roomId")
    .sort("-_id")
    .limit(limit)
    .skip(skip);
  res.render("admin/pages/bookings/index", {
    bookings,
    range: rangerForDot,
    page,
    totalPages,
    moment,
  });
};


//delete booking
exports.delete = async (req, res) => {
   const { id } = req.params;
   await bookingModel.deleteOne({ _id: id });
  return res.redirect("/admin/bookings");
}
