const mongoose = require('mongoose');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    app.listen(port, () => console.log(`Server listening on port ${port}`))

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
