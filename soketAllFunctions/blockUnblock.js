const {userFinder} = require("../utlis/UserFinder")
const userModel = require("../Models/User-Model");
const {getIO} = require("../utlis/socketInstance");
module.exports.blockUnblockUser = async (data) => {
  const user = await userFinder({ 
    key: "_id",
    query: data, 
    includePopulate: true });
    user.block = !user.block;
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
    const allUser = await userModel.find();
    const filterData = allUser.map((item) => ({
    _id: item._id,
    name: item.name,
    email: item.email,
    block: item.block,
    profilepic: item.profilepic,
    pictype: item.pictype,
  }));
  const io = getIO();
  io.emit("updateBlock-center", user);
  io.emit("Update-blockUser", filterData);
};
