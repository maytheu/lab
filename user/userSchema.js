const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SALT_I = 10;
require("dotenv").config();
const crypto = require("crypto");

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
	note: {
    type: Array,
    default: []
  }
})

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
//bcrypt.compare("B4c0/\/", hash).then((res) => {
    // res === true
//});
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
	  console.log(isMatch)
    cb(null, isMatch);
  });
};

mongoose.model("users", userSchema)
