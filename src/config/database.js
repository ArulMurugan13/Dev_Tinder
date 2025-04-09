
//import mongoose
const mongoose = require('mongoose');

//function to connect db

const connectDb =  async ()=>{
    await mongoose.connect(
      "mongodb+srv://ArulMurugan:arulmurugan13@namastenodejs.8opsxoo.mongodb.net/devTinder"
    );
}

module.exports = connectDb;
