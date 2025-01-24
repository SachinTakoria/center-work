
const nodemailer=require("nodemailer")


 const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"sachintakoria2204@gmail.com",
        pass:"gbubkyecdwfdymas"
    }

 })


 const otpToEmailForVerification=async (res,email,otp)=>{ 

 const mailOptions={
    from:"sachintakoria2204@gmail.com",
    to:email,
    subject:"otp for account creation for shopkeeper app",
    text:"Your Otp is "+otp,}
 

 try {
  const info= await transporter.sendMail(mailOptions)
  return res.status(202).json({message:"otp sent successfully",data:info.response})
    
 } catch (error) {
    return res.status(400).json({ message: "Email is not valid" });
    
 }
}
 module.exports={otpToEmailForVerification}

