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
