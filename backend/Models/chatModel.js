// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin

const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // "User" From Model
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // "Message" From Model
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // "User" From Model
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
