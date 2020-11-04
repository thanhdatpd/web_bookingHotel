const mongoose = require("mongoose");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const pagination = require("./../../../libs/pagination");
const contactModel = require("../../models/contactModel");


//get contacts
exports.contacts = async (req, res, next) => {
  const {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.contact(req);

  const contacts = await contactModel
    .find({})
    .populate("userId")
    .sort("-_id")
    .limit(limit)
    .skip(skip);
  res.render("admin/pages/contacts/index", {
    contacts,
    range: rangerForDot,
    page,
    totalPages,
  });
};
//delete contacts
exports.delete = async (req, res) => {
   const { id } = req.params;
   await contactModel.deleteOne({ _id: id });
  return res.redirect("/admin/contacts");
}
