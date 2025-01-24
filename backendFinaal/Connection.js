 const mongoose=require("mongoose")

 const Connection=async ()=>{
  await  mongoose.connect(process.env.MONGODB_CONNECTION)
  .then(() => console.log('Connected to mongodb!'));

}


 module.exports=Connection