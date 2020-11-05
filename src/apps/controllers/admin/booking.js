const mongoose = require("mongoose");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const pagination = require("./../../../libs/pagination");
const bookingModel = require("../../models/bookingModel");
const roomModel = require("../../models/roomModel");
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

//update status bookings
exports.update = async (req, res) => {
  const { id } = req.params;
  const booking = await bookingModel
    .findOne({ _id: id })
    .populate("userId")
    .populate("roomId");
 res.render("admin/pages/bookings/update", {
   booking,
 });
};
//update status bookings
exports.p_update = async (req, res) => {
  try {
    const { id, text, roomId } = req.body;
     if (text === "Chờ nhận phòng") {
       await bookingModel.updateOne(
         { _id: id },
         { $set: { status: "wait_check_in" } }
       );
       await roomModel.updateMany(
         { _id: { $in: roomId } },
         { $set: { status: "empty" } }
       );
     }
    if (text === "Đã nhận phòng") {
       await bookingModel.updateOne(
         { _id: id },
         { $set: { status: "check_in" } }
      );
      await roomModel.updateMany(
        { _id: { $in: roomId } },
        { $set: { status: "ordered" } }
      );
      
    }
    if (text === "Huỷ đặt phòng") {
      await bookingModel.updateOne(
        { _id: id },
        { $set: { status: "fail" } }
      );
      await roomModel.updateMany(
        { _id: { $in: roomId } },
        { $set: { status: "empty" } }
      );
    }
    if (text === "Trả phòng") {
      await bookingModel.updateOne(
        { _id: id },
        { $set: { status: "success" } }
      );
      await roomModel.updateMany(
        { _id: { $in: roomId } },
        { $set: { status: "empty" } }
      );
    }
    return res.status(200).json({
      status: "success",
      message: accountValidation.account_update,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.input_incorrect,
    });
  }
 
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
