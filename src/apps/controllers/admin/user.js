
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../../../config/default");
const { accountValidation, transValidation } = require("../../../errLang/vn")
const userModel = require("../../models/userModel");
const joi = require("joi");
// salt to HashPassword
const salt = bcrypt.genSaltSync(config.app.NUMBER_SALT);
//get user
exports.user = async (req, res, next) => {
   const page = parseInt(req.query.page || 1);
   const limit = 2;

   const skip = (page - 1) * limit;

   const totalDocuments = await userModel.find().countDocuments();

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

   const users = await userModel.find({})
   .sort("-_id")
   .limit(limit)
   .skip(skip)
res.render("admin/pages/users/index", {
   users,
   range: rangerForDot,
   page,
   totalPages,
});
};
//add user
exports.add = async (req, res) => {
  res.render("admin/pages/users/add");
};
exports.p_add = async (req, res, next) => {
   try {
      //check user
      const foundUser = await userModel.findOne({ email: req.body.email });
      if (foundUser)
         return res.status(400).json({
            status: "fail",
            message: accountValidation.account_in_use
         });
      const bodySchema = joi.object({
        email: joi.string().required(),
        fullName: joi.string(),
        password: joi.string().required(),
        phoneNumber: joi.string().min(9),
        role: joi.string(),
        avatar: joi.string(),
        gender: joi.string(),
       
      });
      const value = await bodySchema.validateAsync(req.body)
      //create newUser
      const newUser = new userModel({
        email: value.email,
        fullName: value.fullName,
        password: value.password,
        role: value.role,
        avatar: value.avatar,
        phoneNumber: value.phoneNumber,
        gender: value.gender,
      });
      const hashPassword = await bcrypt.hash(newUser.password, salt);
      newUser.password = hashPassword;
      newUser.save();
      return res.status(200).json({
         status: "success",
         message: accountValidation.account_create
      });
   } catch (error) {
      return res.status(400).json({
         status: "fail",
         message: transValidation.server_incorrect,
      });
   }
}
//edit user
exports.edit = async (req, res) => {
   const { id } = req.params;
   const user = await userModel.findById(id);
   res.render("admin/pages/users/edit", { user});
};
exports.p_edit = async (req, res) => {
   try {
      const { id } = req.params;
      const bodySchema = joi.object({
         id: joi.string(),
         email: joi.string().required(),
         fullName: joi.string(),
         password: joi.string(),
         phoneNumber: joi.string().min(9),
         role: joi.string(),
         avatar: joi.string(),
         gender: joi.string(),

      });
      const value = await bodySchema.validateAsync(req.body)
      //update user
      const updateUser = {
         email: value.email,
         fullName: value.fullName,
         password: value.password,
         // role: value.role,
         // avatar: value.avatar,
          phoneNumber: value.phoneNumber,
         gender: value.gender,
      };
      const hashPassword = await bcrypt.hash(updateUser.password, salt);
      updateUser.password = hashPassword;
      await userModel.updateOne({ _id: id }, updateUser);
      return res.status(200).json({
         status: "success",
         message: accountValidation.account_update
      });
   } catch (error) {
      return res.status(400).json({
         status: "fail",
         message: transValidation.input_incorrect,
      });
   }
   

};

//delete user
exports.p_delete = async (req, res) => {
   const { id } = req.params;
console.log(id);
  const user = await userModel.deleteOne({_id:id});
  res.render("admin/pages/users", { user });
}
