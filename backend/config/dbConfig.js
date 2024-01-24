const mongoose = require("mongoose");
// const mongoose = require("dotenv");

const connentDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useFindAndModify: true,
    });
    console.log("Mongo Connected :", connect.connection.host.cyan.underline);
  } catch (error) {
    console.log("Mongo Connection error :", error.message.yellow.bold);
    process.exit();
  }
};

module.exports = connentDB;
