const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../config/default")
const { accountValidation , transValidation}   = require("../../../errLang/vn")
const userModel = require("../../models/userModel");
const joi = require("joi");
// salt to HashPassword
const salt = bcrypt.genSaltSync(config.app.NUMBER_SALT);
exports.register = (req, res,next) => {
  res.render("auth/register");
};
exports.p_register = async (req, res,next) => {
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
      password: joi.string(),
      phoneNumber: joi.string().min(9),
    });
    const value = await bodySchema.validateAsync(req.body)
    //update user
    const newUser = new userModel ({
      email: value.email,
      fullName: value.fullName,
      password: value.password,
      phoneNumber: value.phoneNumber,
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
      message: transValidation.input_incorrect,
    });
  }

};
exports.login = (req, res) =>{
  res.render("auth/login");
  
};
exports.p_login = async (req, res,next) => {
  try {
    const { email, password } = req.body;
    //Check email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: accountValidation.account_not_find,
      });
    }
    //Check password
    const passLogin = await bcrypt.compare(password, user.password);
    if (user && !passLogin) {
      return res.status(400).json({
        status: "fail",
        message: accountValidation.account_incorrect,
      });
    }
    //create Token
    const token = await jwt.sign({ _id: user._id, role: user.role }, config.app.SECRET_TOKEN, { expiresIn: "24h" });
    return res.status(200).json({
      status: "success",
      message: accountValidation.account_login,
      token: token,    
      role: user.role
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: transValidation.server_incorrect,
    });
  }
};
exports.logout = (req, res, next) => {
  cookie = req.cookies;
  for (var prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }
    res.cookie(prop, "", { expires: new Date(0) });
  }
  res.redirect("/");
};
