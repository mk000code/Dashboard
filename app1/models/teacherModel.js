const mongoose = require('mongoose')

const teacherSchema = mongoose.schema({

    name:{
        type:String,
        required:true
    },

    

})

const Teacher = mongoose.model("Teacher",teacherSchema)

module.exports=Teacher