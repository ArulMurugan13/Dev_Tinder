const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userauth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedData = await jwt.verify(token, "Arul@profile123");
    const {_id} = decodedData;
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

module.exports = userauth;
