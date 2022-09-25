const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const { jwt: token } = await req.cookies;
    if (!token) {
      return res.send({
        success: false,
        message: "Unauthorized request! Please login again.",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.hasOwnProperty("_id")) {
      return res.send({
        success: false,
        message: "Unauthorized request! Please login again.",
      });
    }
    req.authUserId = decoded._id;
    next();
  } catch (error) {
    return res.send({
      success: false,
      message: "Authentication failed ! Please login again.",
    });
  }
};

module.exports = auth;
