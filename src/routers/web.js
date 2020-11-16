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
  ContactsController,
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
router.get("/logout", AuthController.logout);
/* router client */
router.get("/", SiteController.index);
router.get("/abouts", SiteController.about);
router
  .route("/contacts")
  .get(SiteController.contact)
  .post(SiteController.p_contact);
router.get("/rooms", SiteController.room);
router.get("/room-single", SiteController.room_single);
router.get("/room-double", SiteController.room_double);
router.get("/room-vip", SiteController.room_vip);
router.get("/news", SiteController.new);
router.get("/room-detail", SiteController.room_detail);
router.get("/profile", SiteController.profile);
router.get("/checks", SiteController.checks);
router.post("/checkRoom", SiteController.checkRoom);
router
  .route("/checks/confirmAndPay")
  .get(SiteController.confirm)
  .post(SiteController.p_confirm);
router.route("/booking-success").post(SiteController.booking_success);
router.get("/my-bookings", SiteController.myBooking);
router
  .route("/my-services")
  .get(SiteController.myServices)
  .post(SiteController.p_myServices);
router.route("/my-bills").get(SiteController.myBill);
router
  .route("/change-password")
  .get(SiteController.changePassword)
  .post(SiteController.p_changePassword);
/* router admin */
// router.use(checkLogin); // checkLogin

// router.use("/admin" ,checkAdmin); // checkAdmin
//dashboard_User
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
  .get(UserController.delete)


//dashboard_Room
router.get("/admin/rooms", RoomController.room)
router
  .route("/admin/rooms/add")
  .get(RoomController.add)
  .post(RoomController.p_add)
router
  .route("/admin/room-edit/:id")
  .get(RoomController.edit)
  .post(RoomController.p_edit);
  router.route("/admin/room-delete/:id").get(RoomController.delete);

//dashboard_bookings
router.get("/admin/bookings", BookingsController.bookings);
router
  .route("/admin/bookings/add")
  .get(BookingsController.add)
 // .post(BookingsController.p_add);

router.route("/admin/bookings/update/:id")
  .get(BookingsController.update)
  .post(BookingsController.p_update)

router.route("/admin/booking-delete/:id").get(BookingsController.delete);

//dashboard_services
router.get("/admin/services", ServicesController.services)
router
  .route("/admin/services/add")
  .get(ServicesController.add)
  .post(ServicesController.p_add)
router
  .route("/admin/services-edit/:id")
  .get(ServicesController.edit)
  .put(ServicesController.p_edit);
router.route("/admin/services-delete/:id").get(ServicesController.delete);


//dashboard_comments
router.get("/admin/comments", CommentsController.comments);
router.route("/admin/comments-delete/:id").get(CommentsController.delete);

//dashboard_contacts
router.get("/admin/contacts", ContactsController.contacts);
router.route("/admin/contact-delete/:id").get(ContactsController.delete);


module.exports = router;
