const express = require ('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")


require("dotenv").config()

const app = express()

//importihg models
require("./user/userSchema.js")
require("./experiment/experimentSchema.js")


//Basic configuration
//
//mongoose set up
mongoose.connect(process.env.DB_URL,{useNewUrlParser: true, useUnifiedTopology: true })

//hody parser set up
app.use(bodyParser.urlencoded({extended: false}))

//cookie paser
app.use(cookieParser())

//adding cors
app.use(cors())


//check mongoose connection
console.log(mongoose.connection.readyState)

//route
require("./user/userRoute")(app)
require("./admin/adminRoute.js")(app)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
