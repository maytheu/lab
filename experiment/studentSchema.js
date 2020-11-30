const mongoose = require("mongoose")

const studentSchema = mongoose.Schema({
        subject:{
                type:String,
                required: true
        },                                                topic:{
                type: String,
                required:true
        },
	result: {
                type: String,
                required: true
        },
	conclusion: String,                          observation: String,
        note: String
})

mongoose.model("students", studentSchema)
