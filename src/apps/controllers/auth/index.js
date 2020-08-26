const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { accountValidation}   = require("../../../errLang/vn")

const userModel = require("../../models/userModel");
// salt to HashPassword
const salt = bcrypt.genSaltSync(10);
exports.register = (req, res) => {
  res.render("auth/register");
};
exports.postRegister = async (req, res,next) => {
  try {
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
    next(error)
  }

};
exports.login = (req, res) =>{
  res.render("auth/login");
  
};
exports.postLogin = async (req, res,next) => {
  try {
    const { email, password } = req.body;
    //Check email
    const user = await userModel.findOne({ email: email })
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: accountValidation.account_not_find
      });
    }
    //Check password
    const passLogin = await bcrypt.compare(password, hashPassword);
    console.log(passLogin);
    if (user && !passLogin) {
      return res.status(400).json({
        status: "fail",
        message: accountValidation.account_incorrect
      });
    }
    //const token = await user.generateAuthToken()
    // res.send({ user, token })
  } catch (error) {
    next(error)
  }
};
