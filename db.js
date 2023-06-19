const mongoose = require('mongoose');
const url="mongodb://localhost:27017/PaperPad";

const connectToMongo=async()=> {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log("Connected")
  }

module.exports =connectToMongo;