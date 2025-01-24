const mongoose=require("mongoose")
 const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    }, phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    }, city:{
        type:String,
        required:true
    },
    createdat:{
        type:Date,
        default:Date.now
    }
})

 const User=mongoose.model("users",userSchema)
 module.exports=User