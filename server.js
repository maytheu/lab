const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

//importihg models
require("./models/userSchema.js");
require("./experiment/experimentSchema.js");
require("./experiment/subjectSchema.js");
require("./experiment/topicSchema.js");

//Basic configuration
//
//mongoose set up
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//hody parser set up
app.use(express.urlencoded({ extended: true }));

//cookie paser
app.use(cookieParser());

//adding cors
app.use(cors());

//check mongoose connection
console.log(mongoose.connection.readyState);

//route
require("./routes/userRoute")(app);
require("./routes/adminRoute.js")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
