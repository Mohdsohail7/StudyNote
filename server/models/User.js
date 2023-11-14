const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    // Define the name field with type String, required, and trimmed
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    // Define the email field with type String, required, and trimmed
    email:{
        type:String,
        required:true,
        trim:true,
    },
    // Define the password field with type String and required
    password:{
        type:String,
        required:true,
        
    },
    // Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
    accountType:{
        type:String,
        required:true,
        enum:["Admin", "Student", "Instructor"],
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        }
    ],
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    courseProgress:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",
        }
    ],
// Add timestamps for when the document is created and last modified
},
{ timestamps: true }
);

module.exports = mongoose.model("User",userSchema);