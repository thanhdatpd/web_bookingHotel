const mongoose = require("mongoose");
const config = require("../../../config/default");
const multer = require("multer");
const { accountValidation, transValidation } = require("../../../errLang/vn");
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
exports.room = async (req, res) => {
   const rooms = await roomModel.find({})
    .sort("-_id")
    // .limit(limit)
    // .skip(skip)

  res.render("site/room", {rooms});
};
