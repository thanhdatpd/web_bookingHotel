let mongoose = require("mongoose");
let config = require("../../../config/default");
let jwt = require("jsonwebtoken");
let multer = require("multer");
let moment = require("moment");
let { accountValidation, transValidation } = require("../../../errLang/vn");
let pagination = require("./../../../libs/pagination");
let roomModel = require("../../models/roomModel");
let userModel = require("../../models/userModel");
let bookingModel = require("../../models/bookingModel");
let contactModel = require("../../models/contactModel");
let joi = require("joi");
exports.index = (req, res) => {
  res.render("site/home")
};
exports.profile = async (req, res, next) => {
  let token = req.cookies.token;
  let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
  //check decode token with id User
  let user = await userModel.findOne({
    _id: decodeToken._id,
  });
  res.render("site/profile", {user});
}; 
exports.about = (req, res) => {
  res.render("site/about");
};
exports.contact = async (req, res) => {
  try {
    let token = req.cookies.token;
  let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
  //check decode token with id User
  let user = await userModel.findOne({
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
    let newContact = new contactModel({
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
  let {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.room(req);
  let rooms = await roomModel.find({ status: "empty" })
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
  let {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.room_single(req);
  let rooms = await roomModel
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
  let {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.room_double(req);
  let rooms = await roomModel
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
  let {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.room_vip(req);
  let rooms = await roomModel
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
  let { startAt, endAt, id } = req.query; 
  let room = await roomModel.findOne({ _id: id })
  res.render("site/rooms/room-detail" , {room, startAt, endAt});
 
};
exports.checks = async (req, res) => {
  const { startAt, endAt, numberCustomer } = req.query;
  const startAtFormated = moment(startAt + "+0700", "DD-MM-YYYYZ");
  const endAtFormated = moment(endAt + "/23:59:59+0700", "DD-MM-YYYY/HH:mm:ssZ");
  let filter = {
    $or: [
      {
        $and: [
          { startAt: { $gte: startAtFormated } },
          { startAt: { $lt: endAtFormated } },
        ],
      },
      {
        $and: [
          { endAt: { $gte: startAtFormated } },
          { endAt: { $lt: endAtFormated } },
        ],
      },
    ],
  };
  const bookings = await bookingModel.find(filter).populate("roomId");
  if (bookings === undefined || bookings.length == 0) {
    let {
      limit,
      skip,
      range,
      rangerForDot,
      page,
      totalPages,
    } = await pagination.room(req);
    let rooms = await roomModel
      .find({ status: "empty" })
      .sort("-_id")
      .limit(limit)
      .skip(skip);
    res.render("site/rooms/room-result", {
      rooms,
      startAt,
      endAt,
      numberCustomer,
      range: rangerForDot,
      page,
      totalPages,
    }); 
  } else {
    //get list ID in Bookings
    const arrRoomID = bookings.map((booking) => {
      return booking.roomId.map((item) => item._id);
    });
    const arrRoomIDs = arrRoomID.join(",").split(",");
    //panigition
    const page = parseInt(req.query.page || 1);
    const limit = config.app.LIMIT;
    const skip = (page - 1) * limit;
    const totalDocuments = await roomModel
      .find({
        _id: { $nin: arrRoomIDs },
      })
      .countDocuments();
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
    const rooms = await roomModel
      .find({
        _id: { $nin: arrRoomIDs },
      })
      .sort("-_id")
    .limit(limit)
    .skip(skip);
    res.render("site/rooms/room-result", {
      rooms,
      startAt,
      endAt,
      numberCustomer,
      range: rangerForDot,
      page,
      totalPages,
    });
  }
  
};

exports.checkRoom = async (req, res) => {
  try {
    const { startAt, endAt, roomId } = req.body;
    const  startAtFormated = moment(startAt + "+0700", "DD-MM-YYYYZ");
    const endAtFormated = moment(
      endAt + "/23:59:59+0700",
      "DD-MM-YYYY/HH:mm:ssZ"
    );
    let filter = {
      $or: [
        {
          $and: [
            { startAt: { $gte: startAtFormated } },
            { startAt: { $lt: endAtFormated } },
          ],
        },
        {
          $and: [
            { endAt: { $gte: startAtFormated } },
            { endAt: { $lt: endAtFormated } },
          ],
        },
      ],
      roomId: {$in: [roomId]}
  };
  
  let result = await bookingModel.find(filter);
    if (!result.length) {
      return res.status(200).json({
        status: "success",
        message: transValidation.success_room,
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: transValidation.check_room,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "fail",
      message: transValidation.check_incorrect,
    })
  }
};

exports.booking = async (req, res) => {
  let { token, bookings } = req.cookies;
  let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
  //check decode token with id User
  let user = await userModel.findOne({
    _id: decodeToken._id,
  });
  const bookingArr = JSON.parse(bookings);
  const total = bookingArr.reduce((total, booking) => {
    return total + booking.price;
  }, 0)
  
  res.render("site/confirmAndPay", { user, bookingArr, total });
};
exports.p_booking = async (req, res) => {
  try {
    let token = req.cookies.token;
    let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
    const { bookings } = req.cookies;
    let bookingArr = JSON.parse(bookings);
    const startAt = bookingArr.map((booking) => {
      return booking.startAt;
    });
    const endAt = bookingArr.map((booking) => {
      return booking.endAt;
    });
    const numberCustomer = bookingArr.map((booking) => {
      return booking.numberCustomer;
    });
    const arrRoomID = bookingArr.map((booking) => {
      return booking.roomId;
    });
    const total = bookingArr.reduce((total, booking) => {
      return total + booking.price;
    }, 0);
    const newBooking = new bookingModel({
      startAt: moment(startAt[0] + "+0700", "DD-MM-YYYYZ"),
      endAt: moment(endAt[0] + "/23:59:59+0700", "DD-MM-YYYY/HH:mm:ssZ"),
      userId: decodeToken._id,
      roomId: arrRoomID,
      numberCustomer: numberCustomer[0],
      price: total,
    });
    await newBooking.save();
    return res.status(200).json({
      status: "success",
      message: transValidation.input_success,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    })
  }
 
  
};


exports.myBooking = async (req, res) => {
  try {
    let token = req.cookies.token;
    let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
    //check decode token with id User
    let user = await userModel.findOne({
      _id: decodeToken._id,
    });
    //check booking with userId
    let bookings = await bookingModel
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

exports.delete = async (req, res) => {
  try {
     const  roomId = req.body.roomId;
     console.log("roomId", roomId)
     let { bookings } = req.cookies;
     const bookingArr = JSON.parse(bookings);
     var newBooking = bookingArr.filter(function (el) {
       
       return el.roomId != roomId;
     });
     return res.status(200).json({
       status: "success",
       newBooking: newBooking,
       message: transValidation.delete_incorrect,
     });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    });
  } 
};
