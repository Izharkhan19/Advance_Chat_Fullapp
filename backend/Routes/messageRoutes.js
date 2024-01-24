const express = require("express");
const protect = require("../Middlewares/authMiddlewaer");
const {
  sendMessage,
  allMessages,
} = require("../Comntrollers/messageControllers");
// const allMessages = require("../Comntrollers/messageControllers");
const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
