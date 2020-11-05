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
const contactModel = require("../../models/contactModel");
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
exports.contact = async (req, res) => {
  try {
    const token = req.cookies.token;
  const decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
  //check decode token with id User
  const user = await userModel.findOne({
    _id: decodeToken._id,
  });
    if (user) {
      return res.render("site/contact" , {user})
    } 
  } catch (error) {
    res.render("site/contact-no-acc");
  }
};
exports.p_contact = async (req, res) => {
  try {
    //get idUser
    const newContact = new contactModel({
      content: req.body.content,
      userId: req.body.id
    });
    await newContact.save();
    return res.status(200).json({
      status: "success",
      message: transValidation.contact_incorrect,
    });  
  } catch (error) {
     return res.status(400).json({
       status: "fail",
       message: transValidation.server_incorrect,
     });
  }
  
};
exports.new = (req, res) => {
  res.render("site/news");
};
/* @room */
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
  const bookings = await bookingModel.find({
    // status: { $in: ["wait_confirm", "wait_check_in"] },
    startAt: { $gte: moment.utc(startAt).format("DD-MM-YYYY 00:00:00") },
    endAt: { $lt: moment.utc(endAt).format("DD-MM-YYYY 23:59:59") },
  }).populate("roomId");
  console.log("booking", bookings)
 
  const arrRoomID = bookings.map((booking) => {
       return booking.roomId.map((item) => item._id);
  })  
  const arrRooms = [...arrRoomID]

  // console.log("arrRooms", arrRooms);

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
    //check decode token with id User
    const { startAt, endAt, numberCustomer, roomId, contentConfirm , newBookingId } = req.body;
    //get idUser
    const token = req.cookies.token;
    const decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
    if (contentConfirm == "") {
      const newBooking = new bookingModel({
        startAt: moment.utc(startAt).format("DD-MM-YYYY"),
        endAt: moment.utc(endAt).format("DD-MM-YYYY"),
        roomId: [],
        userId: decodeToken._id,
        numberCustomer,
      });
      newBooking.roomId.push(roomId);
      await newBooking.save();
      //delete cookie
      res.clearCookie("newBookingId");
      return res.status(200).json({
        status: "success",
        message: transValidation.input_continue_success,
        newBookingId: newBooking._id,
      });
    } else if (contentConfirm === "OK") {
      await bookingModel.updateOne(
        { _id: newBookingId },
        { $push: { roomId: [roomId] } }
      );
        //delete cookie
      res.clearCookie("newBookingId");
      return res.status(200).json({
        status: "success",
        message: transValidation.input_continue_success,
      });

    }
    
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.check_incorrect,
    });
  }
  
  
};


exports.myBooking = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
    //check decode token with id User
    const user = await userModel.findOne({
      _id: decodeToken._id,
    });
    //check booking with userId
    const bookings = await bookingModel
      .find({ userId: decodeToken._id, })
      .populate("userId")
      .populate("roomId")
      .sort("-_id");
    res.render("site/myBooking", { user, bookings, moment });
    
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    })
  }
}
