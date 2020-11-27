const express = require ('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()

const app = express()

//importihg models
require("./user/userSchema.js")


//Basic configuration
//
//mongoose set up
mongoose.connect(process.env.DB_URL,{useNewUrlParser: true, useUnifiedTopology: true })

//hody parser set up
app.use(bodyParser.urlencoded({extended: false}))

//adding cors
app.use(cors())


//check mongoose connection
console.log(mongoose.connection.readyState)

//user route
require("./user/userRoute")(app)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
