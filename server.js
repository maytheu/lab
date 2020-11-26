const express = require ('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

require("dotenv").config()

const app = express()

//Basic configuration
//
//mongoose set up
mongoose.connect(process.env.DB_URL,{useNewUrlParser: true, useUnifiedTopology: true })

//hody parser set up
app.use(bodyParser.urlencoded({extended: false}))

//check mongoose connection
console.log(mongoose.connection.readyState)

//model
//const {User}= require("./user/userSchema.js")

require("./user/userRoute")(app)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
