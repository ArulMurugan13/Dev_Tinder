
const express = require("express");
const authRouter = express.Router();

const validateSignUpData = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user");



//sign up api
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { fname, lname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fname,
      lname,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) {
      throw new Error("Invalid email Id");
    }
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      throw new Error("Invalid Credentials");
    } else {
      const isPasswordMatch = await existingUser.validatePassword(password);
      if (isPasswordMatch) {
        //create jwt token
        const jwtToken = await existingUser.getJwtToken();
        // parse it in cookie and send
        res.cookie("token", jwtToken, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        res.send("Login Successful");
      } else {
        res.status(400).send("Invalid Credentials");
      }
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});


//log out
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.send("Logout Successfull");
});

module.exports = authRouter;