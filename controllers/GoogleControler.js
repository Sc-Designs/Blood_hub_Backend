const { OAuth2Client } = require("google-auth-library");
const userModel = require("../Models/User-Model");
const EmailSender = require("../utlis/EmailSender");
const emailTemplate = require("../Email_Template/Emails");
const Otp = require("../utlis/OtpFunction");
const userService = require("../Services/user.service");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    // 1. Check if user already exists
    let user = await userModel.findOne({ email });
    const otp = Otp.OtpGenerator();
    // 2. If not, create a new user
    if (!user) {
        const password = "password";
        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({
            name: name,
            email:email,
            password: hashedPassword,
            otp: otp,
            otpExpiry: new Date(Date.now() + 60 * 1000),
          });

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
      res.json(user);
      await EmailSender.sendEmail({
          email: user.email,
          sub: "OTP Verification 📫",
          mess: emailTemplate.registerEmail(otp),
        });
    } else {
        user.otp = otp;
        user.otpExpiry= new Date(Date.now() + 60 * 1000);
        await user.save()
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
        res.json(user);
        await EmailSender.sendEmail({
            email: user.email,
            sub: "🔢Login OTP🔢",
            mess: emailTemplate.loginEmail(otp),
        });
    }
  } catch (error) {
    console.error("Google token verify error:", error);
    res.status(400).json({ error: "Invalid Google token" });
  }
};

module.exports = { verifyGoogleToken };
