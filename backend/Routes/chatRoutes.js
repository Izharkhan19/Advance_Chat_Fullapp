const express = require("express");
const { accessChat, fetchChats, createGroupChats, renameGroup, addToGroup, removeFromGroup } = require("../Comntrollers/chatControllers");
const protect = require("../Middlewares/authMiddlewaer");
const router = express.Router();

router.route("/").post(protect, accessChat);
// Uncomment the routes below if needed
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChats);
router.route("/rename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);

module.exports = router;
