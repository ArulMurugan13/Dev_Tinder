const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

//   /request/send/:status/:userId
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      if (fromUserId.equals(toUserId)) {
        return res.json({ message: "Unable to send request" });
      }
      //valid status
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.json({ message: "Invalid status" });
      }

      //alredy request exist
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.json({ message: "Connection request already exist" });
      }

      const toUserIdExist = await User.findById(toUserId);

      if (!toUserIdExist) {
        return res.status(404).json({ message: "User not found" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();

      res.send({ message:"connection request success"});
    } catch (err) {
      res.status(400).send("Error :" + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const loggedinUserId = req.user._id;
      const requestId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: status + " is not a valid status" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedinUserId,
        status: "interested",
      }).populate("fromUserId", ["fname", "lname"]);

      if (!connectionRequest) {
        return res.status(404).send({ message: "No such connection request" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: " Connection request is " + status, data: data });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }
);

module.exports = requestRouter;
