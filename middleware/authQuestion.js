module.exports = (req, res, next) => {
  if (req.user._id === req.user.qRef) {
    return res.send("You are not allowed here");
  }
  next();
};
