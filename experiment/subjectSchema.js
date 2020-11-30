const mongoose = require("mongoose")

const subjectSchema = mongoose.Schema({                                        
	subject:{
                type: String,
                required:true
        }
})

 mongoose.model("subjects", subjectSchema)
