exports.register = (req, res) => {
  res.render("auth/register", { error: "" });
};
exports.postRegister = (req, res) => {
  res.send('PostRegister ');
};
exports.login = (req, res) =>{
  res.render("auth/login", { error: "" });
};
exports.postLogin = (req, res) => {
  res.send('PostLogin');
};
