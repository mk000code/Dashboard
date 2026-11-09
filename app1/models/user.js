const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({

     email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },


    name:{
        type:String,
        required:true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },

    role:{
        type: String,
        enum: ['admin', 'teacher', 'student'],
        
    }
},{ timestamps: true })

const user = mongoose.model("user",UserSchema)

module.exports=user
