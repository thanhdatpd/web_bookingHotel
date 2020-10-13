const { Router } = require("express");
const {
  AdminController,
  AuthController,
  SiteController,
  UserController,
  RoomController,
  ServicesController,
  BookingsController,
  CommentsController,
} = require("../apps/controllers");
const { checkLogin } = require("../apps/middlewares/checkLogin");
const { checkAdmin } = require("../apps/middlewares/checkAdmin");
const router = Router();
/* router auth (login, logout) */
router
  .route("/login")
  .get(AuthController.login)
  .post(AuthController.p_login);
router
  .route("/register")
  .get(AuthController.register)
  .post(AuthController.p_register);
//router.get("/logout", AuthController.logout);
/* router client */
router.get("/", SiteController.index);
// router.use(checkLogin);
router.get("/profile", SiteController.profile);
/* router admin */
// router.use("/admin" ,checkAdmin);
//dashboard_User
//router.get("/admin/dashboard", checkAdmin, AdminController.dashboard); // tạm ẩn làm chức năng admin
router.get("/admin/dashboard", AdminController.dashboard);
router.get("/admin/users", UserController.user);
router
  .route("/admin/users/add")
  .get(UserController.add)
  .post(UserController.p_add)
router
  .route("/admin/user-edit/:id")
  .get(UserController.edit)
  .put(UserController.p_edit)
router
  .route("/admin/user-delete/:id")
  // .get(UserController.delete);
  .post(UserController.p_delete);


//dashboard_Room
router.get("/admin/rooms", RoomController.room)
router
  .route("/admin/rooms/add")
  .get(RoomController.add)
  .post(RoomController.p_add)
// router
//   .route("/admin/room-edit/:id")
//   .get(RoomController.edit)
//   .put(RoomController.p_edit);

//dashboard_bookings
router.get("/admin/bookings", BookingsController.bookings);

//dashboard_services
router.get("/admin/services", ServicesController.services);

//dashboard_comments
router.get("/admin/comments", CommentsController.comments);

module.exports = router;
