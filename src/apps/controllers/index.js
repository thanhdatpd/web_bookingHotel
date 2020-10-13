const AdminController = require("./admin");
const UserController = require("./admin/user");
const RoomController = require("./admin/room");
const ServicesController = require("./admin/services");
const CommentsController = require("./admin/comment");
const BookingsController = require("./admin/booking");
const AuthController = require("./auth");
const SiteController = require("./site");
//
module.exports = {
  AdminController,
  AuthController,
  SiteController,
  UserController,
  RoomController,
  ServicesController,
  BookingsController,
  CommentsController,
};
