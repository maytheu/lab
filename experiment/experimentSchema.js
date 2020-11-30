const mongoose = require("mongoose")

const experimentSchema = mongoose.Schema({
        subject:{
                type:String,
                required: true
        },                                                title:{
                type: String,
                required:true
        },
        tips: [String],                              image:{
                type:[]
        }
})

mongoose.model("experiments", experimentSchema)
