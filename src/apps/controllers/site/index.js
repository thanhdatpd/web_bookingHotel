let mongoose = require("mongoose");
let config = require("../../../config/default");
let jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let multer = require("multer");
let moment = require("moment");
const VAT = 1 / 10;
let { accountValidation, transValidation } = require("../../../errLang/vn");
let pagination = require("./../../../libs/pagination");
const { formatPrice } = require("./../../../libs/utils");
let roomModel = require("../../models/roomModel");
let userModel = require("../../models/userModel");
let bookingModel = require("../../models/bookingModel");
let commentModel = require("../../models/commentModel");
let contactModel = require("../../models/contactModel");
let servicesModel = require("../../models/servicesModel");
let billServicesModel = require("../../models/billServicesModel");
let billModel = require("../../models/billModel");
let joi = require("joi");
exports.index = (req, res) => {
  res.render("site/home", { error: "" });
};
exports.profile = async (req, res, next) => {
  let token = req.cookies.token;
  let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
  //check decode token with id User
  let user = await userModel.findOne({
    _id: decodeToken._id,
  });
  res.render("site/users/profile", {user});
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
       return res.render("site/users/contact" , {user})
       
    } 
  } catch (error) {
    res.render("site/users/contact-no-acc");
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
    formatPrice,
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
    formatPrice,
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
    formatPrice,
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
    formatPrice,
  });
};
exports.room_detail = async (req, res) => {
   try {
     let token = req.cookies.token;
     let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
     //check decode token with id User
     let user = await userModel.findOne({
       _id: decodeToken._id,
     });
     if (user) {
       let { startAt, endAt, id } = req.query;
       let room = await roomModel.findOne({ _id: id }).populate({
         path: "commentId",
         options: {
           sort: { createdAt: -1 },
           limit: 3,
         },
         populate: {
           path: "userId",
           model: "users",
         },
       });
       const isComment = Object.keys(room.commentId).length !== 0; 
       return res.render("site/rooms/room-detail", {
         room,
         startAt,
         endAt,
         formatPrice,
         moment,
         user,
         isComment,
       });
     }
   } catch (error) {
     res.render("site/home");
   } 
};
exports.checks = async (req, res) => {
  let { startAt, endAt, numberCustomer, numberRoom, price, type } = req.query;
  const startAtFormated = moment(startAt + "+0700", "DD-MM-YYYYZ");
  const endAtFormated = moment(
    endAt + "/23:59:59+0700",
    "DD-MM-YYYY/HH:mm:ssZ"
  );
  if (startAtFormated < Date.now() || endAtFormated < Date.now()) {
    return res.render("site/home", {
      error: "*Ngày tháng nhập vào chưa đúng , xin vui lòng chọn ngày lơn hơn ngày hiện tại !!!",
    });
  }
    if (price === undefined && type === undefined) {
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
          formatPrice,
          numberRoom,
        });
      } else {
        //get list ID in Bookings
        const arrRoomID = bookings.map((booking) => {
          return booking.roomId.map((item) => item._id);
        });
        const arrRoomIDs = arrRoomID.join(",").split(",");
        //panigition
        const page = parseInt(req.query.page || 1);
        const limit = 12;
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
        let rooms = await roomModel
          .find({
            _id: { $nin: arrRoomIDs },
          })
          .sort("-_id")
          .limit(limit)
          .skip(skip);
        return res.render("site/rooms/room-result", {
          rooms,
          startAt,
          endAt,
          numberCustomer,
          range: rangerForDot,
          page,
          totalPages,
          formatPrice,
          numberRoom,
        });
      }
    } else {
      //panigition
      const page = parseInt(req.query.page || 1);
      const limit = 12;
      const skip = (page - 1) * limit;
      let totalDocuments = await roomModel
        .find({ status: "empty" }, { type: type })
        .sort({ price: price })
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
      if (price === "asc") price = 1;
      if (price === "desc") price = -1;
      let rooms = await roomModel
        .find({ status: "empty", type: type })
        .sort({ price: price })
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
        formatPrice,
        numberRoom,
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
    return res.status(400).json({
      status: "fail",
      message: transValidation.check_incorrect,
    })
  }
};
exports.p_confirm = async (req, res) => {
  let { arrRooms } = req.body;
  let infoRooms = await roomModel.find(
    { _id: { $in: arrRooms.arrIds } },
    { name: 1, price: 1 , type:1}
  );
  return res.status(200).json({
    status: "success",
    message: transValidation.input_continue_success,
    infoRooms: {
      infoRooms: infoRooms,
      numberCustomer: arrRooms.numberCustomer,
      startAt: arrRooms.startAt,
      endAt: arrRooms.endAt,
      totalDaysBooking: arrRooms.totalDaysBooking,
    },
  });
};
exports.confirm = async (req, res) => {
  let { token, infoBookings } = req.cookies;
  let infoBookingRooms = JSON.parse(infoBookings);
  let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
  let user = await userModel.findOne({
    _id: decodeToken._id,
  });
  let totals = infoBookingRooms.infoRooms.reduce((total, booking) => {
    return total + (parseInt(booking.price)*infoBookingRooms.totalDaysBooking);
  }, 0);
  res.render("site/users/confirmAndPay", {
    user,
    infoBookingRooms,
    formatPrice,
    totals,
  });
};
exports.booking_success = async (req, res) => {
  try {
    let token = req.cookies.token;
    let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
    let { infoBookings } = req.cookies;
    let infoBookingRooms = JSON.parse(infoBookings);
    const startAt = infoBookingRooms.startAt;
    const endAt = infoBookingRooms.endAt;
    const numberCustomer = infoBookingRooms.numberCustomer;
    const arrRoomID = infoBookingRooms.infoRooms.map((booking) => {
      return booking._id;
    });
    let totals = infoBookingRooms.infoRooms.reduce((total, booking) => {
      return (
        total + parseInt(booking.price) * infoBookingRooms.totalDaysBooking
      );
    }, 0);
    const newBooking = new bookingModel({
      startAt: moment(startAt + "+0700", "DD-MM-YYYYZ"),
      endAt: moment(endAt + "/23:59:59+0700", "DD-MM-YYYY/HH:mm:ssZ"),
      userId: decodeToken._id,
      roomId: arrRoomID,
      numberCustomer: numberCustomer,
      price: totals,
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
    });
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
    res.render("site/users/myBooking", { user, bookings, moment, formatPrice });    
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    })
  }
}
exports.myServices = async (req, res) => {
  try {
    let token = req.cookies.token;
    let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
    //check decode token with id User
    let user = await userModel.findOne({
      _id: decodeToken._id,
    });
    //check booking with userId
    const services = await servicesModel 
      .find()
      .sort("-_id");
    return res.render("site/users/myServices", { services, user, formatPrice });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    });
  }
};
exports.p_myServices = async (req, res) => {
  try {
    let { token } = req.cookies;
    let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
    const { infoServices } = req.body;
    let booking = await bookingModel.findOne({
      userId: decodeToken._id,
      status: "check_in",
    });
    if (!booking) {
      return res.status(400).json({
        status: "fail",
        message: transValidation.oder_room,
      });
    }
    let bill = await billModel.findOne({
      bookingId: booking._id,
    });
    let services = await billServicesModel.findOne({
      bookingId: booking._id,
    });
    if (services) {
      await billServicesModel.updateOne(
        { bookingId: booking._id },
        {
          $push: { servicesId: infoServices },
        }
      );
      let servicesUpdate = await billServicesModel.findOne({
        bookingId: booking._id,
      });
      let totalsService = await servicesUpdate.servicesId.reduce(
        (total, service) => {
          return total + parseInt(service.price) * parseInt(service.quantity);
        },
        0
      );
      await billServicesModel.updateOne(
         { bookingId: booking._id },
        {
          $set: { price: totalsService },
        }
      )
      await billModel.updateOne(
        { bookingId: booking._id },
        {
          $set: {
            billServicesId: services._id,
            price: booking.price + totalsService,
          },
        }
      );
    } else {
      let totalsService = infoServices.reduce((total, service) => {
        return total + parseInt(service.price) * parseInt(service.quantity);
      }, 0);
      let newBillServices = new billServicesModel({
        bookingId: booking._id,
        servicesId: infoServices,
        price: totalsService,
      });
      newBillServices.save();  
      await billModel.updateOne(
        { bookingId: booking._id },
        {
          $set: {
            billServicesId: newBillServices._id,
            price: bill.price + totalsService,
          }, 
        }
      );
    }
    return res.status(200).json({
      status: "success",
      message: transValidation.services_room,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    });
  }
};
exports.myBill = async (req, res) => {
  let { token } = req.cookies;
  let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
  let user = await userModel.findOne({
    _id: decodeToken._id,
  });
  let booking = await bookingModel.findOne({
    userId: decodeToken._id,
    status: "check_in",
  });
  if (!booking) {
    return res.redirect("/my-bookings")
  }
  const bill = await billModel
    .findOne({ bookingId: booking._id })
    .populate({
      path: "bookingId",
      populate: {
        path: "roomId",
        model: "rooms",
      },
    })
    .populate({
      path: "bookingId",
      populate: ({
        path: "userId",
        model: "users",
      }),
    })
    .populate({
      path: "billServicesId",
      populate: {
        path: "servicesId",
        populate: {
          path: "servicesId",
          model: "services",
        },
      },
    });
  const isService = await billModel.find({ "billServicesId": {
    $exists: true,
    $ne: null,
  }
  }).count();
  const totalsPay = (bill.price + bill.price * VAT);
  return res.render("site/users/myBill", {
    bill,
    totalsPay,
    isService,
    moment,
    formatPrice,
  });
};
exports.changePassword = async (req, res) => {
  let token = req.cookies.token;
  let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
  //check decode token with id User
  let user = await userModel.findOne({
    _id: decodeToken._id,
  });
  res.render("site/users/changePassword",{user})
};
exports.p_changePassword = async (req, res) => {
  try {
    let token = req.cookies.token;
    let decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
    //check decode token with id User
    let user = await userModel.findOne({
      _id: decodeToken._id,
    });
    const { password, newPassword } = req.body;
    const oldPassword = await userModel.findOne({ _id: decodeToken._id }, [
      "password",
    ]);
    const comparePass = bcrypt.compareSync(password, oldPassword.password);
    if (comparePass) {
      const passwordUpdate = {
        password: bcrypt.hashSync(newPassword, 10),
      };
      await userModel.updateOne({ _id: decodeToken._id }, passwordUpdate);
      return res.status(200).json({
        status: "success",
        message: transValidation.change_password,
      });
    }
    return res.status(400).json({
      status: "fail",
      message: transValidation.change_password_fail,
    });
  } catch (error) {
    
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    });
  }
};
exports.comments = async (req, res) => {
  try {
    const { userId, roomId, content } = req.body;
    const newComment = await new commentModel({
      userId: userId,
      roomId: roomId,
      content: content,
    });
    newComment.save();
    await roomModel.updateOne({ _id: roomId }, { $push: { commentId: newComment._id } });
    return res.status(200).json({
      status: "success",
      message: transValidation.input_comment_success,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    });
  }
}
