const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = (req, res, next) => {
  let token = req.cookies.w_auth;
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) {
      console.log("0not user");
      return res.json({
        isUser: false,
        error: true,
      });
    } //automatically loh out user after 5 hrd
    else if (
      new Date(user.lastLogin) >
      new Date(user.lastLogin).setHours(5) * 1000
    ) {
      console.log("elapse");
      return res.json({ isUser: false, error: true });
    }
    req.token = token;
    req.user = user;
    next();
  });
};
