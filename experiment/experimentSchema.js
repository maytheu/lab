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

const Experiment = mongoose.model("Experiment", experimentSchema)

module.export ={Experiment}
