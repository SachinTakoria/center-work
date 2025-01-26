 const HandleResponse=require("../HandleResponse/HandleResponse.js")
const {User}= require("../Model/Customer.js")
 const jwt=require("jsonwebtoken")



const checkuserdetails=async (req,res,next)=>{
   const token= req.header("Authorization")
   if(!token) return HandleResponse(res,400,"Token is not found")
  const payload=  jwt.verify(token.process.env.JSON_SECRET_KEY)
if(!payload ||!payload.id)return HandleResponse(res,400,"Invalid Token")

 const existinguser=  await User.findOne({_id:payload.id}).select("-password")
 if(!existinguser) return HandleResponse(res,400,"User not found")
    req.user=existinguser
next()


 }
 module.exports=checkuserdetails