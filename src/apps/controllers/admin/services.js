const mongoose = require("mongoose");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const servicesModel = require("../../models/servicesModel");
const joi = require("joi");

//get services
exports.services = async (req, res, next) => {
  const page = parseInt(req.query.page || 1);
  const limit = 2;

  const skip = (page - 1) * limit;

  const totalDocuments = await servicesModel.find().countDocuments();

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

  const services = await servicesModel
    .find({})
    .sort("-_id")
    .limit(limit)
    .skip(skip);
  res.render("admin/pages/services/index", {
    services,
    range: rangerForDot,
    page,
    totalPages,
  });
};

exports.add = async (req, res) => {
  res.render("admin/pages/services/add");
};
exports.p_add = async (req, res, next) => {
  try {
    //check user
    const foundServices = await servicesModel.findOne({ name: req.body.name });
    if (foundServices)
      return res.status(400).json({
        status: "fail",
        message: accountValidation.account_in_use,
      });
    const bodySchema = joi.object({
      name: joi.string().required(),
      price: joi.string().required(),
    });
    const value = await bodySchema.validateAsync(req.body);
    //create newServices
    const newServices = new servicesModel({
      name: value.name,
      price: value.price,
    });
    newServices.save();
    return res.status(200).json({
      status: "success",
      message: accountValidation.account_create,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    });
  }
};


exports.edit = async (req, res) => {
  const { id } = req.params;
  const services = await servicesModel.findById(id);
  res.render("admin/pages/services/edit", { services });
};
exports.p_edit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateServices = {
      name: req.body.name,
      price: req.body.price,
    };
    await servicesModel.updateOne({ _id: id }, updateServices);
    return res.status(200).json({
      status: "success",
      message: accountValidation.account_create,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    });
  }
};
//delete services
exports.delete = async (req, res) => {
   const { id } = req.params;
   await servicesModel.deleteOne({ _id: id });
  return res.redirect("/admin/services");
}
