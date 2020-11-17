const mongoose = require("mongoose");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const pagination = require("./../../../libs/pagination");
const servicesModel = require("../../models/servicesModel");
const billServicesModel = require("../../models/billServicesModel");
const { formatPrice } = require("./../../../libs/utils");
const joi = require("joi");

//get services
exports.services = async (req, res, next) => {
  const {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.services(req);
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
//bills services
exports.billServices = async (req, res) => {
  const { id } = req.params;
   let services = await billServicesModel
     .find({
       bookingId: id,
     })
     .populate({
       path: "servicesId",
       populate: {
         path: "servicesId",
         models: "services",
       },
     })
     .sort("-_id");
  res.render("admin/pages/services/bill-services", { services, formatPrice });
}
