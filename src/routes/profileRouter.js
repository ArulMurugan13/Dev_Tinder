const express = require("express");
const userAuth = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

//profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send({ message: "Your Profile", data: req.user });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

//edit profile

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData) {
      throw new Error("Unable to update profile");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(
      (keys) => (loggedInUser[keys] = req.body[keys])
    );
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.fname} , your profile updation done`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

//update password
profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const isStrongPassword = validator.isStrongPassword(newPassword);
    if (!isStrongPassword) {
      throw new Error("Password is weak,Enter strong password");
    }

    const loggedInUser = req.user;
    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();
    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
