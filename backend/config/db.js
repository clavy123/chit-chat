const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/hostinger', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); // Exit if error occurs
  }
};

module.exports = connectDB;

