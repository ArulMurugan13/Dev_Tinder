const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/request", userAuth, async (req, res) => {
  try {
    const loggedinUserId = req.user._id;
    const allRequests = await ConnectionRequest.find({
      toUserId: loggedinUserId,
      status: "interested",
    }).populate("fromUserId", ["fname", "lname"]);

    res.json({ message: "Your connection requests", data: allRequests });
  } catch (err) {
    res.status(400).send({ meassage: err.meassage });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedinUserId = req.user._id;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedinUserId, status: "accepted" },
        { toUserId: loggedinUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["fname", "lname"])
      .populate("toUserId", ["fname", "lname"]);

    const data = connections.map((row) => {
      if (row.fromUserId.toString() === loggedinUserId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.send({ message: "Your Connecctins", data: data });
  } catch (err) {
    res.status(400).send({ message: err.meassage });
  }
});

module.exports = userRouter;
