const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../config/default")
const { accountValidation , transValidation}   = require("../../../errLang/vn")
const userModel = require("../../models/userModel");

exports.register = (req, res,next) => {
  res.render("auth/register");
};
exports.p_register = async (req, res,next) => {
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
    const token = await jwt.sign({ _id: user._id, role: user.role }, config.app.SECRET_TOKEN, { expiresIn: "3h" });
    console.log(user.role);
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
