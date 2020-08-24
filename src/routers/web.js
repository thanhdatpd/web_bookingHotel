const { Router } = require("express");
const {
  AdminController,
  AuthController,
  SiteController
} = require("../apps/controllers");
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
/* router admin */
//router.get("/admin/dashboard", AdminController.dashboard);
/* router client */
router.get("/", SiteController.index);

module.exports = router;
