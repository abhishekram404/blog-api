const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    console.log("headers", req.headers);
    const token = await req.header("Authorization").split(" ")[1];
    console.log("token", token);
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized request! Please login again.",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    if (!decoded.hasOwnProperty("_id")) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized request! Please login again.",
      });
    }
    req.authUserId = decoded._id;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Authentication failed ! Please login again.",
    });
  }
};

module.exports = auth;
