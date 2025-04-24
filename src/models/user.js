const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//schema validation
const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: { type: String },
    age: { type: Number },
    city: { type: String },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password Must be strong");
        }
      },
    },
    skills:{type : [String]},
    about : {type : String},
    experience : {type : Number},
    photourl : {type : String}
  },
  { timestamps: true }
);

//schema methods
//this keyword not works in arrow function
userSchema.methods.getJwtToken = async function () {
  const jwtToken = await jwt.sign({ _id: this._id }, "Arul@profile123", {
    expiresIn: "7d",
  });

  
  return jwtToken;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(passwordByUser, user.password);

  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;

//timeStamps - provides -> crateat ,updateAt
