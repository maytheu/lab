const mongoose = require('mongoose')
const SHA1 = require("crypto-js/sha1")

const User = mongoose.model('users')
const Experiment= mongoose.model("experiments")
const Subject = mongoose.model("subjects")
const Topic = mongoose.model("topics")

const  authUser = require("./authUser.js")
const authTeacher = require("./authTeacher.js")

module.exports = (app) =>{

	function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//register route
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


//accept username or email
	app.post("/api/user/login", (req, res) => {
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

//returns user profile summary
app.get("/api/user/profile", authUser, (req, res)=>{
	User.findOne({_id: req.user._id}, (err, user) =>{
		if (err) return res.json({success: false, err})
		console.log(user)
		
		return res.status(200).send({                       success: true, user
    });
	
	})
})

//update user and returns the uodated vajue
app.post("/api/user/update_profile", authUser, (req, res)=>{                                                        User.findOneAndUpdate({_id: req.user._id},
	{ $set:req.body },
	{ new: true },
	(err, user) =>{                                                           if (err) return res.json({success: false, err})
		return res.status(200).send({
                  success: true, user                 });
        })                                        })

//delete the experiment and update the user db
//the route accept quety ofbindex +1
app.get("/api/user/del_exp", authUser, (req, res) =>{
	let index = req.query.index
	console.log(index)

	User.findOneAndUpdate({_id: req.user._id},{$pull:{experiment:{id:req.user.experiment.splice(index,1)[0].id}}},{new: true}, (err, user) =>{                        
		if (err) return res.json({success: false, err})     
		console.log(user)
		return res.status(200).send({                     success: true, exp: user.experiment              })

	})
})

//Edit the user ecperiment, accept query of index
app.post("/api/user/edit_exp", authUser, (req, res) =>{
	let index = req.query.index
	index--
	console.log(req.user.experiment[index].id)
	User.updateOne({_id: req.user._id, "experiment.id": req.user.experiment[index].id},{$set:{"experiment.$.result": req.query.result, "experiment.$.conclusion": req.body.conclusion, "experiment.$.obeervation": req.body.observation}}, {new: true},(err,user) =>{
		console.log(user)
		if (err) return res.json({ success: false, err });                                 
		res.status(200).json({ success: true });
	})
})

//returns subject to the userr
app.get("/api/user/subject", authUser, (req, res) =>{
	Subject.find({}, (err, exp) =>{
		if (err) return res.json({ success: false, err });                                                  res.status(200).json({ success: true, exp });
	})
})

//usage http://...../api/user/topic?subject=physics
//Returns array of object of topics
app.get("/api/user/topic", authUser, (req,res) =>{
	let subject = req.query.subject.toLowerCase()
	subject = subject.charAt(0).toUpperCase()+subject.slice(1)

	Topic.find({subject},(err, topic) =>{
		if (err) return res.json({ success: false, err });                                                  res.status(200).json({ success: true, topic });
	})
})

//returns material user/exp?exp=exp
app.get("/api/user/exp/", authUser, (req, res) =>{
	const exp = "Heat"/*req.query.exp*/
	Experiment.find({topic:exp}, (err, doc) =>{
		if (err) return res.json({ success: false, err });                                                  res.status(200).json({ success: true, doc});
		const expe = convertArrayToObject(doc, "_id")                                      
		console.log(expe)
		doc.map(pp =>{
			console.log(pp._id.toString().expe)
	//		console.log(convertArrayToObject(pp,pp, _id))
		})
	
	})
})

//save user experiment
//querty  api/user/experimenf?subject=&topic&result
app.post("/api/user/experiment", authUser, (req, res) =>{
	const date = new Date()
	const expId = `exp-${SHA1(
    req.user._id
  ).toString()
    .substring(0, 5)}${date.getSeconds()}${date.getMilliseconds()}`;
	let exp = []
	exp.push({
		id: expId,
		subject: req.query.subject,
		topic: req.query.topic,
		result: req.query.result,
		conclusion: req.body.conclusion,
		observation: req.body.observation
	})
	User.findOneAndUpdate({_id: req.user._id},{$push:{experiment: exp}},{new: true},(err, data) =>{
		if (err) return res.json({ success: false, err });                                                  res.status(200).json({ success: true, data});
	})
})

//user ask question with query topic=
app.post("/api/user/question", authUser, (req, res) =>{
	const date = new Date()                 
	const qId = `Q-${SHA1(                    req.user._id                                    ).toString()                                        .substring(0, 5)}${date.getSeconds()}${date.getMilliseconds()}`;

	let question=[]
	question.push({
		id: qId,
		tag: req.query.topic,
		username: req.user.username,
		question: req.body.question
	})

	User.findOneAndUpdate({_id: req.user._id},{$push :{question}},(err, doc) =>{
		if (err) return res.json({ success: false, err });                                                  res.status(200).json({ success: true, doc});
	})
})


app.get("/api/user/answer_question", authUser, authTeacher, (req, res) =>{
	const date = new Date()
        const aId = `A-${SHA1(
req.user._id).toString()                                        .substring(0, 5)}${date.getSeconds()}${date.getMilliseconds()}`;
	let answer = []
	answer.push({
		qId: req.query.qid,
		id: aId,
		tag: req.query.topic,
                username: req.user.username,    
		answer: req.body.answer
	})
	User.findOneAndUpdate({_id: req.user._id},{$push :{answer}},(err, doc) =>{                                if (err) return res.json({ success: false, err });                                                  res.status(200).json({ success: true, doc});
	})
})

//retur all questions and the answer
app.get("/api/user/view_question", authUser, (req, res) =>{
	User.find({},(err, doc) =>{
	if (err) return res.json({ success: false, err });                                                  res.status(200).json({ success: true, doc});	
	})
})

app.get("/api/user/logout", authUser,(req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    });
  });
});

}
