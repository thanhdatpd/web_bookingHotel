const mongoose = require("mongoose");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn");
const pagination = require("./../../../libs/pagination");
const commentModel = require("../../models/commentModel");
const joi = require("joi");

//get comments
exports.comments = async (req, res, next) => {
  const {
    limit,
    skip,
    range,
    rangerForDot,
    page,
    totalPages,
  } = await pagination.comment(req);

  const comments = await commentModel
    .find({})
    .populate("userId")
    .populate("roomId")
    .sort("-_id")
    .limit(limit)
    .skip(skip);
  res.render("admin/pages/comments/index", {
    comments,
    range: rangerForDot,
    page,
    totalPages,
  });
};
//delete comment
exports.delete = async (req, res) => {
   const { id } = req.params;
   await commentModel.deleteOne({ _id: id });
  return res.redirect("/admin/comments");
}
