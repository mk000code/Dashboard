const { default: mongoose } = require("mongoose");

const studentSchema = new mongoose.Schema({
     studentId: {
        type: String,
        required: true,
        unique: true
    },
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    course:{
        type:String,
        required:true
    },
     cgpa: {
        type: Number,
        min: 0,
        max: 10,
       default: 0
    }
})
const Student = mongoose.model("Student",studentSchema)

module.exports=Student