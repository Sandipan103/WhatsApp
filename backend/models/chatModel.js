const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    groupName : {type : String, trim : true},
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Msg",
    },
    allChatMessages : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Msg",
    }],
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timestamp:{ type: Date, default: Date.now, },
    isTimerEnabled: { type: Boolean, default: false },
    timer: { type: Number, default: 0 } ,
  },
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
