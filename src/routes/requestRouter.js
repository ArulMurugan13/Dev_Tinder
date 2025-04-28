const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.fname + " - sent a connection request");
});

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;


      if(fromUserId.equals(toUserId))
      {
        return res.json({ message: "Unable to send request" });
      }
      //valid status
      const allowedStatus = ["interested" , "ignored"];
      if(!allowedStatus.includes(status))
      {
          return res.json({message :"Invalid status"});
      }

      //alredy request exist
      const existingConnectionRequest = await ConnectionRequest.findOne({$or:[{fromUserId,toUserId} ,{fromUserId:toUserId , toUserId:fromUserId}]});

      if(existingConnectionRequest)
      {
        return res.json({message:"Connection request already exist"})
      }

      const toUserIdExist = await User.findById(toUserId);

      if(!toUserIdExist)
      {
        return res.status(404).json({message : "User not found"});
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();

      res.send("connection request success");
    } catch (err) {
      res.status(400).send("Error :" + err.message);
    }
  }
);

module.exports = requestRouter;
