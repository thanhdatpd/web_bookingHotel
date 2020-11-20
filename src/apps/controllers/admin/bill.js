const mongoose = require("mongoose");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const { formatPrice } = require("./../../../libs/utils");
const pagination = require("./../../../libs/pagination");
const billModel = require("../../models/billModel");
const VAT = 1/10;
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

  const bills = await billModel
    .find({})
    .populate({
      path: "bookingId",
      populate: {
        path: "roomId",
        model: "rooms",
      },
    })
    .populate({
      path: "bookingId",
      populate: {
        path: "userId",
        model: "users",
      },
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

//get detailBills
exports.detailBills = async (req, res, next) => {
  const { id } = req.params;
  const bill = await billModel
    .findOne({ _id: id })
    .populate({
      path: "bookingId",
      populate: {
        path: "roomId",
        model: "rooms",
      },
    })
    .populate({
      path: "bookingId",
      populate: {
        path: "userId",
        model: "users",
      },
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
   const isService = await billModel
     .find({
       billServicesId: {
         $exists: true,
         $ne: null,
       },
     })
     .count();
  const totalsPay = bill.price + bill.price * VAT;
  res.render("admin/pages/bills/billPay", {
    bill,
    totalsPay,
    isService,
    moment,
    formatPrice,
  });
};

//get pays
exports.pays = async (req, res, next) => {
  const {idBill} = req.body
  console.log("idBill", idBill)
  // update room
  //update booking
  
};
