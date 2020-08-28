const { Router } = require("express");
const {
  AdminController,
  AuthController,
  SiteController
} = require("../apps/controllers");
const { checkLogin } = require("../apps/middlewares/checkLogin");
const { checkAdmin } = require("../apps/middlewares/checkAdmin");
const router = Router();
/* router auth (login, logout) */
router
  .route("/login")
  .get(AuthController.login)
  .post(AuthController.postLogin);
router
  .route("/register")
  .get(AuthController.register)
  .post(AuthController.postRegister);
//router.get("/logout", AuthController.logout);
/* router client */
router.get("/", SiteController.index);
//router.use(checkLogin);
router.get("/profile", SiteController.profile);
/* router admin */
//router.use(checkAdmin);
//router.get("/admin/dashboard", checkAdmin, AdminController.dashboard); // tạm ẩn làm chức năng admin
router.get("/admin/dashboard", AdminController.dashboard);
router.get("/admin/users", AdminController.users);

module.exports = router;
