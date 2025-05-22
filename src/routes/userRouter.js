const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/requests", userAuth, async (req, res) => {
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

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedinUserId = req.user._id;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedinUserId, status: "accepted" },
        { toUserId: loggedinUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", "fname lname age about photourl")
      .populate("toUserId", "fname lname age about photourl");

    const data = connections.map((row) => {
      const fromId =
        row.fromUserId._id?.toString() || row.fromUserId.toString();
      const toId = row.toUserId._id?.toString() || row.toUserId.toString();

      if (fromId === loggedinUserId.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.send({ message: "Your Connecctins", data: data });
  } catch (err) {
    res.status(400).send({ message: err.meassage });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const existingConnection = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const connectionSet = new Set();

    existingConnection.forEach((row) => {
      connectionSet.add(row.fromUserId.toString());
      connectionSet.add(row.toUserId.toString());
    });

    const feedData = await User.find({
      $and: [
        { _id: { $nin: Array.from(connectionSet) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("fname lname photourl about")
      .skip(page * limit - limit)
      .limit(limit);

    res.json({ message: "Here is your feed", data: feedData });
  } catch (err) {
    res.status(400).send({ message: err.meassage });
  }
});

module.exports = userRouter;
