const jwt = require("jsonwebtoken");
const config = require("../../config/default");
const userModel = require("../models/userModel");
exports.checkAdmin = async (req, res, next) => {
    const role = req.user.role;
    if (role === 'admin') {
      return next();
    }
    return res.json("Bạn không có quyền quản trị !!!!")
}
