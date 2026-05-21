const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://2k22cse2213255_db_user:Ahad4562@cluster0.urmscaa.mongodb.net/?appName=Cluster0"
    );

    console.log("MongoDB Connected 🚀");

  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;