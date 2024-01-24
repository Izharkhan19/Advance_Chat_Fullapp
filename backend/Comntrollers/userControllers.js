const asyncHandler = require("express-async-handler");
const userModel = require("../Models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  //Test CASES Keep in mind :
  // Existing user check
  // Hash password
  // User create step
  // Token Generate

  const { name, email, password, pic } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User alresdy exist." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      pic: pic,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      user: result,
      token: token,
      message: "User created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const authUser = async (req, res) => {
  //Test CASES Keep in mind :
  // Existing check
  // decrypt db Hash password
  // User create step
  // Token Generate
  const { username, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    console.log("existingUser.password", existingUser.password);
    console.log("password", password);
    console.log("matchPassword", matchPassword);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      user: existingUser,
      token: token,
      message: "logged in Successfully",
    });
  } catch (error) {
    console.log("Login Err... :", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user._id } });
  res.send(users);
};

module.exports = { registerUser, authUser, allUsers };
