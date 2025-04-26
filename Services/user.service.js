const userModel = require("../Models/User-Model");
module.exports.createUser = async ({
  name,
  email,
  dob,
  password,
  otp,
  otpExpiry,
  address,
  gender,
  googleId,
  verified,
}) => {
  if (!email || !password || !name || !dob) {
    throw new Error("All fields are required!");
  }
  const user = await userModel.create({
    name,
    email,
    dob,
    password,
    otp,
    otpExpiry,
    address,
    gender,
    googleId,
    verified,
  });
  return user;
};
