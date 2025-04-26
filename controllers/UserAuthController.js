const userModel = require("../Models/User-Model");
const {validationResult} = require("express-validator");
const userService = require("../Services/user.service");
const Otp = require("../utlis/OtpFunction");
const EmailSender = require("../utlis/EmailSender");
const emailTemplate = require("../Email_Template/Emails");
const {userFinder} = require("../utlis/UserFinder");

module.exports.registerUser = async (req, res) => {
  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password} = req.body;
    const userExists = await userFinder({
      key: "email",
      query: email,
    });
    if(userExists){
        return res.status(400).json("User Already Exists");
    }
    const hashedPassword = await userModel.hashPassword(password);
    const otp = Otp.OtpGenerator();
    const user = await userService.createUser({
      name: name,
      email:email,
      password: hashedPassword,
      otp: otp,
      otpExpiry: new Date(Date.now() + 60 * 1000),
    });
    await user.save();
    res.status(201).json(user);
    await EmailSender.sendEmail({
      email: user.email,
      sub: "OTP Verification 📫",
      mess: emailTemplate.registerEmail(otp),
    });
  }catch(err){
    console.error(err);
    return res.status(500).json({message: "Something went wrong"});
  }
}

module.exports.loginUser = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
   try {
     const user = await userFinder({
       key: "email",
       query: req.body.email,
       includePassword: true
     });
     if (!user)
       return res.status(401).json({ error: "Invalid email or password" });
     const isMatch = await user.ComparePassword(req.body.password);
     if (!isMatch)
       return res.status(401).json({ error: "Invalid email or password" });

    const OTP = Otp.OtpGenerator();
    const OtptpExpiry = new Date(Date.now() + 60 * 1000);

    user.otp = OTP;
    user.otpExpiry = OtptpExpiry;
    await user.save();

     delete user._doc.password;
     delete user._doc.otp;
     delete user._doc.otpExpiry;
     delete user._doc.emergencycontact;
     delete user._doc.gender;
     delete user._doc.age;
     delete user._doc.googleId;
     delete user._doc.createdAt;
     delete user._doc.updatedAt;
     delete user._doc.__v;
     res.status(200).json({ user });
     await EmailSender.sendEmail({
       email: user.email,
       sub: "🔢Login OTP🔢",
       mess: emailTemplate.loginEmail(OTP),
     });
   } catch (error) {
     console.log(error);
     return res.status(500).json({ error: error.message });
   }
};

module.exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const User = req.user;

    const user = await userFinder({
      key: "email",
      query: User.email,
      includePopulate: true
    })

    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilepic = req.file.buffer.toString("base64");
    user.pictype = req.file.mimetype;
    await user.save();
    delete user._doc.password;
    delete user._doc.otp;
    delete user._doc.otpExpiry;
    delete user._doc.emergencycontact;
    delete user._doc.gender;
    delete user._doc.age;
    delete user._doc.googleId;
    delete user._doc.createdAt;
    delete user._doc.updatedAt;
    delete user._doc.__v;
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.GetProfile = async ( req,res ) => {
  return res.status(200).json({ user: req.user });
};

module.exports.varifyOtp = async (req, res) => {
  try {
    const { email, otpValue } = req.body;
    if (!email || !otpValue) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await userFinder({
      key: "email",
      query: email,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp != otpValue) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(401).json({ error: "OTP has expired" });
    }

    const token = user.GenerateToken();

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Send welcome email
    await EmailSender.sendEmail({
      email: user.email,
      sub: "🔢Login OTP🔢",
      mess: emailTemplate.welcomeEmail,
    });
    res.status(200).json({ token });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.reSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userFinder({
      key: "email",
      query: email,
    });
    const OTP = Otp.OtpGenerator();
    const OtptpExpiry = new Date(Date.now() + 60 * 1000);
    user.otp = OTP;
    user.otpExpiry = OtptpExpiry;
    await user.save();
  } catch (err) {
    console.log(err);
  }
};

module.exports.alldets = async (req,res) => {
  try{
    const {
      number,
      emargencyNumber,
      dob,
      weight,
      height,
      address,
      gender,
      bloodGroup,
    } = req.body;
    const user = req.user;
    const validUser = await userFinder({
      key:"_id",
      query: user._id,
      includePopulate:true
    })
    if(!validUser) return res.status(404).json("Unauthorized Access!");
    validUser.number = number;
    validUser.emergencycontact = emargencyNumber;
    validUser.dob = dob;
    validUser.dateOfBirth = dob;
    validUser.gender = gender;
    validUser.weight = weight;
    validUser.height = height;
    validUser.address = address;
    validUser.bloodgroup = bloodGroup;
    await validUser.save();
    return res.status(200).json(validUser);
  }catch(err){
    console.log(err);
  }
}