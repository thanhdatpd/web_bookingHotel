const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("../libs/mongo-db");

app.use("/assets", express.static(path.join(__dirname, "..", "public")));
//middelwares
//app.use(checkLogin);
//Using body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Using template engine
app.set("views", path.join(__dirname, "..", "apps", "views"));
app.set("view engine", "ejs");
// Using cookie-parser
app.use(cookieParser());



app.use("/api", require("../routers/api"));
app.use("/", require("../routers/web"));
app.use("*", (req, res) =>{
  return res.render("admin/layouts/404");
});

module.exports = app;
