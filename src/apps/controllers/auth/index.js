
exports.login = (req, res) =>{
  res.render("auth/login", { error: "" });
};
exports.postLogin = (req, res) => {
  res.send('PostLogin');
};
