const mongoose = require("mongoose");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const { formatPrice } = require("./../../../libs/utils");
const pagination = require("./../../../libs/pagination");
const billModel = require("../../models/billModel");
const moment = require("moment");
const joi = require("joi");
//get bookings
exports.bills = async (req, res, next) => {
  // const {
  //   limit,
  //   skip,
  //   range,
  //   rangerForDot,
  //   page,
  //   totalPages,
  // } = await pagination.booking(req);

   const bills = await billModel.find({})
    .populate("userId")
     .populate({
       path: 'bookingId',
       populate: {
         path: 'roomId',
         model: 'rooms'
       }
     })
    .populate("billServicesId")
  //   .sort("-_id")
  //   .limit(limit)
  //   .skip(skip);
  res.render("admin/pages/bills/index", {
    bills,
    // range: rangerForDot,
    // page,
    // totalPages,
     moment,
    // formatPrice,
  });
};
