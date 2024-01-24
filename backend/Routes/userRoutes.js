// const express = require("express");
// const { registerUser } = require("../Comntrollers/userControllers");
// const { authUser } = require("../Comntrollers/userControllers");
// const router = express.Router();

// router.route("/").post(registerUser);
// router.route("/login", authUser);

// module.exports = router;

const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../Comntrollers/userControllers"); // Fix typo here
const protect = require("../Middlewares/authMiddlewaer");
const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/login").post(authUser); // Use .post() for the login route

module.exports = router;
