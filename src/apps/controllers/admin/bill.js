const mongoose = require("mongoose");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const { formatPrice } = require("./../../../libs/utils");
const pagination = require("./../../../libs/pagination");
const billModel = require("../../models/billModel");
const bookingModel = require("../../models/bookingModel");
const roomModel = require("../../models/roomModel");
const VAT = 1/10;
const moment = require("moment");
const joi = require("joi");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs")


// ejs.registerHelper("dateFormat", (value, format) => {
//   return moment(value).format(format)
// })

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
    })
    .sort("_id")
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
  //  const isService = await billModel
  //    .findOne({_id:id,
  //      billServicesId: {
  //        $exists: true,
  //        $ne: null,
  //      },
  //    })
  //   .count();
  const totalsPay = bill.price + bill.price * VAT;
  res.render("admin/pages/bills/billPay", {
    bill,
    totalsPay,
    // isService,
    moment,
    formatPrice,
  });
};

//get pays
exports.pays = async (req, res, next) => {
  try {
    const { idBill } = req.body;
    const bill = await billModel
      .findOne({ _id: idBill })
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
      });
    //update booking
    await bookingModel.updateOne(
      { _id: bill.bookingId._id },
      { $set: { status: "success" } }
    );
    await roomModel.updateMany(
      { _id: { $in: bill.bookingId.roomId } },
      { $set: { status: "empty" } }
    );
    //  
  
    return res.status(200).json({
      status: "success",
      message: transValidation.pay,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.input_incorrect,
    });
  }
  
};

exports.createBill = async (req, res) => {
  try {
    const { idBill } = req.query;
    const bill = await billModel
      .findOne({ _id: idBill })
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
      });
    const totalsPay = bill.price + bill.price * VAT;
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "views/admin/pages/bills/payPfd.ejs"
      );
      const html = fs.readFileSync(filePath, "utf-8");
      const content = await ejs.render(html, {
        bill,
        moment,
        formatPrice,
        totalsPay,
      });
      await page.setContent(content);
      await page.pdf({
        path: "src/apps/views/admin/pages/bills/invoice/bill.pdf",
        format: "A4",
        printBackground: true,
      });
      await browser.close();
    })();
    return res.status(200).json({
      status: "success",
      message: transValidation.bill,
    })
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.input_incorrect,
    });
  }
}
