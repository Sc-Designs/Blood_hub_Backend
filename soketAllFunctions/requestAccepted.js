const bloodRequestModel = require("../Models/Recivent-Model");
const userModel = require("../Models/User-Model");
const { userFinder } = require("../utlis/UserFinder");

module.exports.requestAccepted = async ({ data, userSockets }) => {
  try {
    const { postId, donarId, donarNumber } = data;
    console.log("📬 Request Accepted Data:", data); // Debug log

    const post = await bloodRequestModel.findById(postId);
    if (!post) {
      console.log(`❌ Post with ID ${postId} not found.`);
      return;
    }
    console.log(`🩸 Updating post status for Post ID: ${postId}`);

    post.status = "Accepted";
    post.donarId = donarId;
    post.DonarNumber = donarNumber;
    await post.save();

    const donor = await userFinder({
      key: "_id",
      query: donarId,
    });
    console.log(`💼 Found donor ${donarId}:`, donor);

    donor.Donate.push(postId);
    await donor.save();

    // Fetch all pending posts with matching blood type
    const allPendingPosts = await bloodRequestModel
      .find({ status: "pending", bloodType: donor.bloodgroup })
      .populate({
        path: "reciventId",
        model: "user",
        select: "-password -__v",
      });
    console.log(
      `🩸 Found ${allPendingPosts.length} pending posts for blood group: ${donor.bloodgroup}`
    );

    const filteredPosts = allPendingPosts.filter(
      (item) => item.reciventId?._id.toString() !== donarId.toString()
    );

    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const donorSocket = userSockets.get(donarId.toString());
    if (donorSocket) {
      console.log(`📡 Emitting "newUpdate" event to donor ${donarId}`);
      donorSocket.emit("newUpdate", filteredPosts);
    } else {
      console.log(`❌ Donor socket not found for userId: ${donarId}`);
    }

    // Send updates to the receiver
    const receiverUser = await userModel
      .findById(post.reciventId.toString())
      .populate({
        path: "bloodRequest",
        model: "recipient",
        select: "-password -__v",
      });
    console.log(`📦 Sending receiver update to ${post.reciventId}`);

    const receiverSocket = userSockets.get(receiverUser._id.toString());
    if (receiverSocket) {
      console.log(
        `📡 Emitting "reciver-update" to receiver ${receiverUser._id}`
      );
      receiverSocket.emit("reciver-update", receiverUser);
    } else {
      console.log(
        `❌ Receiver socket not found for userId: ${receiverUser._id}`
      );
    }
  } catch (err) {
    console.error("❌ Error in requestAccepted:", err.message);
  }
};

