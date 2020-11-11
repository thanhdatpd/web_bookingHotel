const ejs = require("ejs");
const path = require("path");

const format = new Intl.NumberFormat("vi-VN", { 
  currency: "VND",
});

exports.formatPrice = (numb) => {
  return format.format(numb);
};
