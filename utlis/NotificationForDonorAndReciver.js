const { userFinder } = require("./UserFinder");
const EmailSender = require("./EmailSender");
const emailTemplate = require("../Email_Template/Emails");
module.exports.NotifyUsers = async ({reciventId, donorId})=>{
    try{
        const reciver = await userFinder({
            key: "_id",
            query: reciventId
        })
        const donor = await userFinder({
            key: "_id",
            query: donorId
        })
        await EmailSender.sendEmail({
          email: reciver.email,
          sub: "Blood Request Accepted By Donar 🎉",
          mess: emailTemplate.ReciventEmail({
            name: donor.name,
            number,
            type: bloodRequest.bloodType,
          }),
        });
        await EmailSender.sendEmail({
          email: donor.email,
          sub: "Blood Request Accepted By You ❤️",
          mess: emailTemplate.DonarEmail({
            name: reciver.name,
            number: bloodRequest.reciverNumber,
            type: bloodRequest.bloodType,
          }),
        });
    }catch(err){
        console.log(err);
    }
}