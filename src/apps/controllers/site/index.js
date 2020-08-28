
exports.index = (req, res) => {
  res.render("site/home")
};
exports.profile = (req, res, next) => {
  
   res.json("Trang ca nhan sau khi da dang nhap");
 };
