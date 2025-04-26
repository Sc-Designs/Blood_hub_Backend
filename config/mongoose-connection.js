//////////////////////////////////////////IMPORT THE REQIREMENT////////////////////////////////////////

// Import the Mongoose
const mongoose = require("mongoose");

// Import The Config Module
const config = require("config");

// Custom Mongoose Link
const link = `${config.get("MONGODB_URI")}/BloodHeroes_Hub`;

// Import The Debug Module and set it for only development Environment
const dbgr = require("debug")("development:dev");

// Mongoose Connection_Retry
const connectWithRetry = () => {
  mongoose
    .connect(link, {
      serverSelectionTimeoutMS: 5000, // Adjust the timeout as needed
    })
    .then(function () {
      dbgr("connect");
    })
    .catch(function (err) {
      dbgr(err);
      setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
    });
};

// Export the Mongoose
module.exports = connectWithRetry;

///////////////////////////////////////////////////END/////////////////////////////////////////////////
