const express = require("express");
const { generateOtp, verifyotp } = require("../Services/otpService/otpService");
const {
  otpToEmailForVerification,
} = require("../Services/emailService/emailservice");
const { User, Shopkeeper } = require("../Model/Customer");
const Product=require("../Model/Product")

const router = express.Router();

router.get("/HealthCheckApi", async (req, res) => {
  return res.status(200).json({ message: "server health is okay" });
});

router.post("/verifyShopkeeper", async (req, res) => {
  try {
    const { name, phone, email, password, address, city, state } = req.body;
    if (!name || !phone || !email || !password || !address || !city || !state)
      return res.status(404).json({ message: "field is empty" });

    const existinguser = await User.findOne({ email });
    if (existinguser)
      return res.status(400).json({ message: "Account already exist" });

    const otp = generateOtp(email);
    return await otpToEmailForVerification(res, email, otp);
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
});

router.post("/createShopkeeper", async (req, res) => {
  try {
    const { name, phone, email, address, password, city, state, otp } =
      req.body;

    if (!name || !phone || !email || !address || !password || !city || !state)
      return res.status(404).send({ message: "Field is empty" });

    if (!otp) return res.status(404).send({ message: "Enter the otp" });

    const existinguser = await User.findOne({ email });
    if (existinguser)
      return res.status(400).json({ message: "Account already exists" });

    const resonse = verifyotp(email, otp);

    if (!resonse.status)
      return res.status(404).json({ message: resonse.message });

    const result = await Shopkeeper.create({
      name,
      phone,
      email,
      password,
      address,
      city,
      state,
    });

    return res
      .status(201)
      .json({ message: "Account created successfully", result });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
      error: error.message || "Unknown error occurred",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(404).json({ message: "Field is Empty" });

    const result = await User.findOne({ email });
    if (!result) return res.status(401).json({ message: "Invalid Email" });

    if (password === result.password) {
      if (!result.service)
        return res.status(401).json({ message: "Your service is disabled" });
      return res
        .status(202)
        .json({ message: "Login successfully", data: result._id });
    }
    return res.status(401).json({ message: "Invalid Password" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error", error });
  }
});

router.post("/enable", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(404).json({ message: "Plz Select the user" });

    const existinguser = await User.findOne({ _id: id });
    if (!existinguser)
      return res.status(404).json({ message: "User is not found" });

    const result = await User.updateOne(
      { _id: id },
      { $set: { service: true } }
    );
    return res.status(202).json({ message: "Service is enabled", result });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error", error });
  }
});

router.post("/disable", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(404).json({ message: "Plz Select the user" });

    const existinguser = await User.findOne({ _id: id });
    if (!existinguser)
      return res.status(404).json({ message: "User is not found" });

    const result = await User.updateOne(
      { _id: id },
      { $set: { service: false } }
    );
    return res.status(202).json({ message: "Service is disabled", result });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error", error });
  }
});

router.post("/addproduct", async (req, res) => {
  try {
    const {
      name,
      company,
      model,
      description,
      price,
      discount,
      rate,
      tax,
      stock,
      userid,
    } = req.body;

    if (
      !name ||
      !company ||
      !model ||
      !description ||
      !price ||
      !discount ||
      !rate ||
      !tax ||
      !userid
    )
      return res.status(404).json({ message: "Field is Empty" });

    const existingproduct = await Product.findOne({ model });
    if (existingproduct)
      return res
        .status(400)
        .json({ message: "Product of this model already exists" });

    const newproduct = await Product.create({
      userid,
      name,
      company,
      model,
      description,
      price,
      discount,
      rate,
      tax,
      stock,
    });
    return res
      .status(201)
      .json({ message: "Product added successfully", newproduct });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error", error });
  }
});

router.get("/getProducts",async(req,res)=>{
  try {
    
  const allProducts= await Product.find({userid:"67911b387dd3934777f1a70b"})
  if(allProducts===0)
    return res.status(404).json({message:"Your product list is empty"})

  return res.status(202).json({message:"All products fetched successfully",allProducts})
    
  } catch (error) {
    return res.status(500).json({message:"internal server error",error})
    
  }
})

router.put("/updateProduct/:id",async(req,res)=>{
  try {
    const{name,company,model,stock,description,price,discount,rate,tax}=req.body
    if(!name||!company||!model||!description||!price||!discount||!rate||!tax)
      return res.status(404).json({message:"field is empty"})
    const {id}=req.params
    if(!id)
      return res.status(404).json({message:"pls select the product"})

  const existingproduct= await Product.findOne({_id:id})
  if(!existingproduct)
    return res.status(404).json({message:"this product is not found in your product list"})

 const response= await Product.findOne({model})
 if(response)
  return res.status(400).json({message:"product of this model already exist in your product list"})

 const updateProduct= await Product.updateOne({_id:id},{$set:{name,company,model,description,price,discount,rate,tax,stock}})
 return res.status(202).json({message:"product updated successfully",updateProduct})
} catch (error) {
  return res.status(500).json({message:"internal server errror",error})
    
  }
})




module.exports = router;
