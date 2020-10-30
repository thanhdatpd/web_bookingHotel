const mongoose = require("mongoose");
const config = require("../../../config/default");
const multer = require("multer");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const pagination = require("./../../../libs/pagination");
const roomModel = require("../../models/roomModel");
const joi = require("joi");
exports.index = (req, res) => {
  res.render("site/home")
};
exports.profile = (req, res, next) => {
  
   res.json("Trang ca nhan sau khi da dang nhap");
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

  res.render("site/room", { rooms, range: rangerForDot, page, totalPages });
};
exports.room_detail = async (req, res) => {
  const { id } = req.params;
  const room = await roomModel.findOne({_id:id})
  res.render("site/room-detail" , {room});
};
