const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SALT_I = 10;
require("dotenv").config();
const crypto = require("crypto");

//max login attemot = 5 ahd you can onkybtry again after 2hrs
const MAX_LOGIN_ATTEMPTS = 5
 const   LOCK_TIME = 2 * 60 * 60 * 1000;

const userSchema = mongoose.Schema({ 
email: {
    type: String,
    required: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  firstName: {
    type: String,
  required: true,
    maxLength: 50
  },
  lastName: {
    type: String,
   required: true,
    maxLength: 50
  },
username:{
  type: String,
  required: true,
	maxLength: 15,
	unique:1
},
teacher:{
	type: Number,
	default:0
},
instituition:{
	type: String,
	required: true,
	maxLength:50
},
	token: {
    type: String
  },
  resetToken: {
    type: String
  },
  resetTokenExp: {
    type: Number
  },
DOB:{
	type:Date,
	required: true
},
sex:{
	type: String,
        required: true
},
	teacherToken: {
    type: String
  },
admin:{
	type: Number,
	default:0
},
	experiment: {
    type: Array,
    default: []
  },
	question: [],
	answer:[],
	loginAttempts: { 
		type: Number, 
		required: true,
		default: 0 },
    lockUntil: {
	    type: Number 
    },
	lastLogin: Date,
	qRef: String
})

userSchema.virtual('isLocked').get(function() {
// check for a future lockUntil timestamp
return !!(this.lockUntil && this.lockUntil > Date.now());
});


//confirm user password before saving
//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1 
userSchema.pre("save", function(next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_I, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
	      console.log(user.password)
        next();
      });
    });
  } else {
    next();
  }
});

//compare users password with hash to login
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
	  console.log(isMatch)
    cb(null, isMatch);
  });
};


userSchema.methods.incLoginAttempts = function(cb) { 
	// if we have a previous lock that has expired, restart at 1
	if (this.lockUntil && this.lockUntil < Date.now()) { 
		return this.update({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } }, cb);
	} 
	// otherwise we're incrementing
	var updates = { $inc: { loginAttempts: 1 } };
	// lock the account if we've reached max attempts and it's not locked already
	if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
		updates.$set = { lockUntil: Date.now() + LOCK_TIME };
	}
	return this.update(updates, cb);
};



userSchema.statics.getAuthenticated = function(username, password, isEmail, cb) {
	let obj; 
	if(isEmail){
		obj= { email: username}
	}else {
		obj = { username}
	}
	this.findOne(obj, function(err, user) {
    // make sure the user exists
    if (!user) {
        return cb(null, null, "NOT_FOUND");
    }

    // check if the account is currently locked
    if (user.isLocked) {
        // just increment login attempts if account is already locked
        return user.incLoginAttempts(function(err) {
            if (err) return cb(err);
            return cb(null, null, "MAX_ATTEMPT")
        });
	    
    }

    // test for a matching password
    user.comparePassword(password, function(err, isMatch) {
        if (err) return cb(err);

        // check if the password was a match
        if (isMatch) {
            // if there's no lock or failed attempts, just return the user
            if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
            // reset attempts and lock info
            var updates = {
                $set: { loginAttempts: 0 },
                $unset: { lockUntil: 1 }
            };
            return user.update(updates, function(err) {
                if (err) return cb(err);
                return cb(null, user);
            });
        }
return cb(null, null, "PASSWORD_INCORRECT")

    });
});
};


userSchema.methods.generateToken = function(cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), process.env.SECRET);
  user.token = token;
  user.save(function(err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
}

userSchema.statics.findByToken = function(token, cb) {
  var user = this;

  jwt.verify(token, process.env.SECRET, function(err, decode) {
    user.findOne({ _id: decode, token: token }, function(err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};


mongoose.model("users", userSchema)
