const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId , required:true},
  toUserId: { type: mongoose.Schema.Types.ObjectId , required: true},
  status: {
    type: String,
    enum: {
      values: ["interested", "ignored", "accepted", "requested"],
      message: `{VALUE}  - incorrect status type`,
    },
    required:true,
  },
},{
    timestamps:true
});

//model should always in capital
const ConnectionRequest = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
