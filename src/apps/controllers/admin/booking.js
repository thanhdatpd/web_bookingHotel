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
//add bookings
exports.add = async (req, res) => {
  res.render("admin/pages/bookings/add");
};
// exports.p_add = async (req, res, next) => {
//   try {
//     //check user
//     const foundServices = await servicesModel.findOne({ name: req.body.name });
//     if (foundServices)
//       return res.status(400).json({
//         status: "fail",
//         message: accountValidation.account_in_use,
//       });
//     const bodySchema = joi.object({
//       name: joi.string().required(),
//       price: joi.string().required(),
//     });
//     const value = await bodySchema.validateAsync(req.body);
//     //create newServices
//     const newServices = new servicesModel({
//       name: value.name,
//       price: value.price,
//     });
//     newServices.save();
//     return res.status(200).json({
//       status: "success",
//       message: accountValidation.account_create,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       status: "fail",
//       message: transValidation.server_incorrect,
//     });
//   }
// };



//delete booking
exports.delete = async (req, res) => {
   const { id } = req.params;
   await bookingModel.deleteOne({ _id: id });
  return res.redirect("/admin/bookings");
}
