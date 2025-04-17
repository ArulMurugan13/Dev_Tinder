//importng express
const express = require("express");
//creating the express app
const app = express();
//importing db connction
const connectDb = require("./config/database.js");
const User = require("./models/user.js");
const validateSignUpData = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookie = require("cookie-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/auth.js");

//middleware - no path - runs for all -
//helps to convert json to js obj
app.use(express.json());
app.use(cookieParser());

//sign up api
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
        res.cookie("token", jwtToken , {expires : new Date(Date.now() + 7*24*60*60*1000)});
        res.send("Login Successful");
      } else {
        res.status(400).send("Invalid Credentials");
      }
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

//profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

//log out
app.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.send("Logout Successfull");
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.fname + " - sent a connection request");
});

connectDb()
  .then(() => {
    console.log("DB is connected successfully");
    app.listen(3000, () => {
      console.log("Server Starts Running... listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("Something went wrong db is not cponnected");
  });

app.use("/user", (req, res) => {});
