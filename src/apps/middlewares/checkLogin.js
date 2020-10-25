const jwt = require("jsonwebtoken");
const config = require("../../config/default");
const userModel = require("../models/userModel");
exports.checkLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodeToken = jwt.verify(token, config.app.SECRET_TOKEN);
    //check decode token with id User 
    const user = await userModel.findOne({
      _id: decodeToken._id
    })
    if (!user) {      
      return res.json("Bạn chưa đăng nhập , vui lòng đăng nhập lại")
    }
    req.user = user
    next();
  } catch (error) {
    return res.render("admin/layouts/404");
  }
}
