
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../../../config/default")
const { accountValidation, transValidation } = require("../../../errLang/vn")
const userModel = require("../../models/userModel");
//get user
exports.user = async (req, res,next) => {
   const users = await userModel.find({});
   res.render("admin/pages/users/index", {users});
};
//add user
exports.add = async (req, res) => {
  res.render("admin/pages/users/add");
};
exports.p_add = async (req, res, next) => {
   try {
      // salt to HashPassword
      const salt = bcrypt.genSaltSync(config.app.NUMBER_SALT);
      //check user
      const foundUser = await userModel.findOne({ email: req.body.email });
      if (foundUser)
         return res.status(400).json({
            status: "fail",
            message: accountValidation.account_in_use
         });
      //create newUser
      const newUser = new userModel(req.body);
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
exports.p_edit = async (req, res, next) => {
   try {
      const { id } = req.body;
      console.log(id);
      let infoUser = {};
      if (req.body.password) { infoUser.password = req.body.password; }   // salt to HashPassword
      const salt = bcrypt.genSaltSync(config.app.NUMBER_SALT);
      //create updateUser
      const updateUser = new userModel(infoUser)
      console.log(updateUser);
      const hashPassword = await bcrypt.hash(updateUser.password, salt);
      updateUser.password = hashPassword;
      await userModel.updateOne({_id: id}, updateUser)
      return res.status(200).json({
         status: "success",
         message: accountValidation.account_create
      });
   } catch (error) {
      console.log(error, "Errr");
      return res.status(400).json({
         status: "fail",
         message: transValidation.server_incorrect,
      });
   }
}
