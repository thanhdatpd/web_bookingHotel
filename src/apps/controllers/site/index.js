const mongoose = require("mongoose");
const config = require("../../../config/default");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const moment = require("moment");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const pagination = require("./../../../libs/pagination");
const roomModel = require("../../models/roomModel");
const userModel = require("../../models/userModel");
const bookingModel = require("../../models/bookingModel");
const joi = require("joi");
exports.index = (req, res) => {
  res.render("site/home")
};
exports.profile = async (req, res, next) => {
  const token = req.cookies.token;
  const decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
  //check decode token with id User
  const user = await userModel.findOne({
    _id: decodeToken._id,
  });
  res.render("site/profile", {user});
};
 
exports.about = (req, res) => {
  res.render("site/about");
};
exports.contact = (req, res) => {
  res.render("site/contact");
};
exports.new = (req, res) => {
  res.render("site/news");
};
exports.room = async (req, res) => {
  const {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.room(req);
  const rooms = await roomModel.find({ status: "empty" })
    .sort("-_id")
    .limit(limit)
    .skip(skip)

  res.render("site/rooms/room", {
    rooms,
    range: rangerForDot,
    page,
    totalPages,
  });
};
exports.room_single = async (req, res) => {
  const {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.room_single(req);
  const rooms = await roomModel
    .find({ status: "empty", type: "single"})
    .sort("-_id")
    .limit(limit)
    .skip(skip);

  res.render("site/rooms/room-single", {
    rooms,
    range: rangerForDot,
    page,
    totalPages,
  });
};
exports.room_double = async (req, res) => {
  const {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.room_double(req);
  const rooms = await roomModel
    .find({ status: "empty", type: "double" })
    .sort("-_id")
    .limit(limit)
    .skip(skip);

  res.render("site/rooms/room-double", {
    rooms,
    range: rangerForDot,
    page,
    totalPages,
  });
};
exports.room_vip = async (req, res) => {
  const {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.room_vip(req);
  const rooms = await roomModel
    .find({ status: "empty", type: "vip" })
    .sort("-_id")
    .limit(limit)
    .skip(skip);

  res.render("site/rooms/room-vip", {
    rooms,
    range: rangerForDot,
    page,
    totalPages,
  });
};
exports.room_detail = async (req, res) => {
  const { id } = req.params;
  const room = await roomModel.findOne({_id:id})
  res.render("site/rooms/room-detail" , {room});
};

exports.check = async (req, res) => {
  const { startAt, endAt, numberCustomer } = req.body;

  // console.log(new Date(startAt));
  // console.log(new Date(startAt).getTime());
  // const a = req.body;
  // console.log(moment.utc(startAt).format('YYYY-MM-DD HH:mm:ss'));
  // console.log(moment.utc(endAt).format("YYYY-MM-DD HH:mm:ss"));
  const booking = await bookingModel.find({
    startAt: { $gte: moment.utc(startAt).format("YYYY-MM-DD 00:00:00") },
    endAt: { $lt: moment.utc(endAt).format("YYYY-MM-DD 23:59:59") },
  })
     const arrRoom = booking.map(roomId => roomId.roomId)  
  res.json(arrRoom);

  // console.log("exports.check -> booking", booking)

  
  //   // .populate("roomId");
  // const arrRoom = booking.map((roomId) => {

  //     return roomId.roomId;
  // })

  //  console.log("exports.check -> arrRoom", arrRoom);

  // res.json(booking);
  // const {
  //   limit,
  //   skip,
  //   range,
  //   rangerForDot,
  //   page,
  //   totalPages,
  // } = await pagination.room(req);
  // const rooms = await roomModel
  //   .find({ status: "empty" })
  //   .sort("-_id")
  //   .limit(limit)
  //   .skip(skip);

  // res.render("site/rooms/room-result", {
  //   rooms,
  //   range: rangerForDot,
  //   page,
  //   totalPages,
  // });
};


exports.booking = async (req, res) => {
  try {
    //get idUser
    const token = req.cookies.token;
    const decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
    //check decode token with id User
    const { startAt, endAt, numberCustomer, roomId } = req.body;
    const newBooking = new bookingModel({
      startAt: moment.utc(startAt).format('DD-MM-YYYY'),
      endAt: moment.utc(endAt).format('DD-MM-YYYY'),
      roomId: [],
      userId: decodeToken._id,
      numberCustomer,
    });
    newBooking.roomId.push(roomId);
    await newBooking.save();
    return res.status(200).json({
      status: "success",
      message: transValidation.input_success,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    });
  }
  
  
};
