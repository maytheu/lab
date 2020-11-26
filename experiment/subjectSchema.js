const mongoose = require("mongoose")

const subjectSchema = mongoose.Schema({                                        
	subject:{
                type: String,
                required:true
        }
})

const Subject = mongoose.model("Subject", subjectSchema)

module.export ={Subject}
