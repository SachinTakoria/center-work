const express = require("express");
const { generateOtp, verifyotp } = require("../Services/otpService/otpService");
const {
  otpToEmailForVerification,
} = require("../Services/emailService/emailservice");
const { User, Shopkeeper } = require("../Model/Customer");
const Product = require("../Model/Product");
const checkuserdetails = require("../Middlewares/CheckUserDetails");
const HandleResponse = require("../HandleResponse/HandleResponse");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/HealthCheckApi", async (req, res) => {
  HandleResponse(res, 200, "server Health is ok");
});

router.post("/verifyShopkeeper", async (req, res) => {
  try {
    const { name, phone, email, password, address, city, state } = req.body;
    if (!name || !phone || !email || !password || !address || !city || !state)
      return HandleResponse(res, 404, "Field is empty ");

    const existinguser = await User.findOne({ email });
    if (existinguser) return HandleResponse(res, 400, "Account already exist");

    const otp = generateOtp(email);
    return await otpToEmailForVerification(res, email, otp);
  } catch (error) {
    return HandleResponse(res, 500, "Internal server error", error);
  }
});

router.post("/createShopkeeper", async (req, res) => {
  try {
    const { name, phone, email, address, password, city, state, otp } =
      req.body;

    if (!name || !phone || !email || !address || !password || !city || !state)
      return HandleResponse(res, 404, "field is empty");

    if (!otp) return HandleResponse(res, 404, "pls enter the otp");

    const existinguser = await User.findOne({ email });
    if (existinguser) return HandleResponse(res, 400, "Account already exist");

    const response = verifyotp(email, otp);

    if (!response.status) return HandleResponse(res, 404, response.message);

    const result = await Shopkeeper.create({
      name,
      phone,
      email,
      password,
      address,
      city,
      state,
    });

    return HandleResponse(res, 201, "Account created successfully", result);
  } catch (error) {
    return HandleResponse(resp, 500, "Internal Server error", null, error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log incoming request for debugging
    console.log("Request Body: ", req.body);

    if (!email || !password) {
      console.log("Missing email or password");
      return HandleResponse(res, 404, "Field is empty");
    }

    const result = await User.findOne({ email });

    console.log("User Found: ", result);

    if (!result) {
      console.log("Invalid Email");
      return HandleResponse(res, 404, "Invalid Email");
    }

    if (password === result.password) {
      console.log("Password Matched");

      if (!result.service) {
        console.log("Service Disabled");
        return HandleResponse(res, 401, "Your service is disabled");
      }

      const payload = { id: result._id };

      // Verify the environment variable is loaded
      if (!process.env.JSON_SECRET_KEY) {
        throw new Error("JSON_SECRET_KEY is not defined in environment");
      }

      const token = jwt.sign(payload, process.env.JSON_SECRET_KEY);

      console.log("Token Generated: ", token);

      return HandleResponse(res, 202, "Login successfully", { token });
    }

    console.log("Invalid Password");
    return HandleResponse(res, 404, "Invalid Password");
  } catch (error) {
    console.error("Error in /login route: ", error); // Log the actual error
    return HandleResponse(res, 500, "Internal Server error", null, {
      message: error.message,
      stack: error.stack,
    });
  }
});


router.post("/enable", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return HandleResponse(res, 404, "Plz Select the user");

    const existinguser = await User.findOne({ _id: id });
    if (!existinguser) return HandleResponse(res, 404, "User is not found");

    const result = await User.updateOne(
      { _id: id },
      { $set: { service: true } }
    );
    return HandleResponse(res, 202, "Service is enabled", result);
  } catch (error) {
    return HandleResponse(res, 500, "Internal Server error", null, error);
  }
});

router.post("/disable", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return HandleResponse(res, 404, "Plz Select the user");

    const existinguser = await User.findOne({ _id: id });
    if (!existinguser) return HandleResponse(res, 404, "User is not found");

    const result = await User.updateOne(
      { _id: id },
      { $set: { service: false } }
    );
    return HandleResponse(res, 202, "Service is disabled", result);
  } catch (error) {
    return HandleResponse(res, 500, "Internal Server error", null, error);
  }
});
router.post("/fetchuserdetails",checkuserdetails,async(req,res)=>{
  const payload={id:req.user._id}
  const token=jwt.sign(payload,process.env.JSON_SECRET_KEY)
  return HandleResponse(res,202,"Login Successfully",{role:req.user.role,token})
})

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
      return HandleResponse(res, 404, "Field is Empty");
    const existingproduct = await Product.findOne({ model });
    if (existingproduct)
      return HandleResponse(res, 400, "Product of this model already exists");

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
    return HandleResponse(res, 201, "Product added successfully", newproduct);
  } catch (error) {
    return HandleResponse(res, 500, "Internal Server error", null, error);
  }
});

router.get("/getProducts", async (req, res) => {
  try {
    const allProducts = await Product.find({
      userid: "67911b387dd3934777f1a70b",
    });
    if (allProducts === 0)
      return HandleResponse(res, 404, "Your product list is empty");

    return HandleResponse(
      res,
      202,
      "All products fetched successfully",
      allProducts
    );
  } catch (error) {
    return HandleResponse(res, 500, "Internal server error", null, error);
  }
});

router.put("/updateProduct/:id", async (req, res) => {
  try {
    const {
      name,
      company,
      model,
      stock,
      description,
      price,
      discount,
      rate,
      tax,
    } = req.body;
    if (
      !name ||
      !company ||
      !model ||
      !description ||
      !price ||
      !discount ||
      !rate ||
      !tax
    )
      return HandleResponse(res, 404, "Field is Empty");

    const { id } = req.params;
    if (!id) return HandleResponse(res, 404, "Plz select the product");

    const existingproduct = await Product.findOne({ _id: id });
    if (!existingproduct)
      return HandleResponse(
        res,
        404,
        "This product is not found in your product list"
      );

    const response = await Product.findOne({ model });
    if (response)
      return HandleResponse(
        res,
        400,
        "Product of this model is already exists in your product list"
      );

    const updateProduct = await Product.updateOne(
      { _id: id },
      {
        $set: {
          name,
          company,
          model,
          description,
          price,
          discount,
          rate,
          tax,
          stock,
        },
      }
    );
    return HandleResponse(
      res,
      202,
      "Product updated successfully",
      updateProduct
    );
  } catch (error) {
    return HandleResponse(res, 500, "Internal server error", null, error);
  }
});

router.delete("/deleteproduct/:id", checkuserdetails, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return HandleResponse(res, 404, "Plz select the product");

    const existingproduct = await Product.findOne({
      _id: id,
      userid: req.user._id,
    });
    if (!existingproduct)
      return HandleResponse(
        res,
        404,
        "This product is not found in your product list."
      );

    const result = await Product.deleteOne({ _id: id, userid: req.user._id });
    return HandleResponse(res, 202, "Product deleted successfully", result);
  } catch (error) {
    return HandleResponse(res, 500, "Internal Server error", null, error);
  }
});

module.exports = router;
