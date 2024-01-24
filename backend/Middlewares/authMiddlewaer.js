const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // Decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, login Failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorised, no token.");
  }
};

module.exports = protect;
