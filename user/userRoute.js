const mongoose = require('mongoose')

const User = mongoose.model('users')
const {Experiment}= require("./experimentSchema.js")

module.exports = (app) =>{
	app.get("/", (req, res) =>{
		res.send("hey, its working")
	})

	app.post("/api/user_profile", (req, res)=>{
		res.json({onSuccess:"Profipe succesful"})
	})

	app.get("/api/user/register", (req, res) => {
  /*const date = new Date();
  const pId = `${date.getFullYear()}${date.getSeconds()}${date.getMilliseconds()}`;
*/
  const user = new User({
    email:req.body.email,/*mayteu98@co.com"*/
    firstName: req.body.firstName,
	  lastName: req.body.lastName,
    password:req.body.password,/*"1234567890"*/
    username: req.body.username,
    instituition: req.body.institution,
	  teacher: req.body.teacher,
	 DOB:req.body.dob,
	  sex: req.body.sex
  });

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});


	app.post("/api/user/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({ success: false, err: "Email not found" });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ success: false, err: "Incorrect password" });

//	    res.status(200).json({ success: true });
  /*    user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        user.lastLogin = moment();

        user.save((err, user) => {
          if (err) return res.json({ success: false, err });
          res
            .cookie("w_auth", user.token)
            .status(200)
            .json({
              loginSuccess: true
            });
        });
      });*/
    });
  });
});
}
