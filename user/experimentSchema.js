const mongoose = require("mongoose")

const experimentSchema = mongoose.Schema({
        user:{
                type:String,
                required: true
        },                                                title:{
                type: String,
                required:true
        },
        observation: String,                              result:{
                type:[]
        }
})
                                                  const Experiment = mongoose.model("Experiment", experimentSchema)
                                                  module.export ={Experiment}
