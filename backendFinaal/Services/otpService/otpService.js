 const crypto=require("crypto")
  const otpMap=new Map()

   const generateOtp=(email)=>{
   const number= crypto.randomInt(0,1000000)
  const otp= String(number).padStart(6,"7")
  const expiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
  otpMap.set(email,otp,expiry)
  return otp

  }

  const verifyotp = (email, otp) => {
    const otpentry = otpMap.get(email);
    if (!otpentry) {
      return { status: false, message: "OTP is not found or expired" };
    }
    if (otpentry === otp.toString()) {
      otpMap.delete(email);
      return { status: true, message: "OTP Matched Successfully" };
    }
    return { status: false, message: "Invalid OTP" };
  };
  
  module.exports={generateOtp,verifyotp}