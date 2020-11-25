const mongoose = require("mongoose")

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
	type: String,
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
