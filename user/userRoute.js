const mongoose = require('mongoose')

const User = mongoose.model('users')
const {Experiment}= require("./experimentSchema.js")

module.exports = (app) =>{
	app.get("/", (req, res) =>{
		console.log(validateEmail("maytheu@gmail.com"))
		res.send("hey, its working")
	})

	app.post("/api/user_profile", (req, res)=>{
		res.json({onSuccess:"Profipe succesful"})
	})

	function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

	app.post("/api/user/register", (req, res) => {
  
  const user = new User({
    email:req.body.email,
    firstName: req.body.firstName,
	  lastName: req.body.lastName,
    password:req.body.password,
    username:req.body.username,
  instituition: req.body.institution,
	  teacher: req.body.teacher,
	 DOB:req.body.dob,
	  sex:req.body.sex
  });

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});


	app.get("/api/user/login", (req, res) => {
let isEmail = validateEmail(req.body.email)
	
  User.getAuthenticated(req.body.email, req.body.password, isEmail, function(err, user, reason) {
	  console.log("err"+err)
	  console.log("readon "+reason)
    if (!user) {
	    console.log(reason)
	    // otherwise we can determine why we failed    
	    
	    switch (reason) {      
		    case "NOT_FOUND":
		case "PASSWORD_INCORRECT":
		    res.json({success:"Invalid user ir Invorrect Password"})
		break;
        case "MAX_ATTEMPTS":                            // send email or otherwise notify user that account is                                              // temporarily locked             
			    break;                                    }
    }

    // login was successful if we have a user
	  else {
        // handle login success
        console.log('login success');

     user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

       user.lastLogin = Date.now()

        user.save((err, user) => {
          if (err) return res.json({ success: false, err });
          res
            .cookie("w_auth", user.token)
            .status(200)
            .json({
              success: true
            });
        });
      });
}
})
});
}
