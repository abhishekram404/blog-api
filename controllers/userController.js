const User = require("../models/User");
const registerValidator = require("../middlewares/registerValidator");
const updateValidator = require("../middlewares/updateValidator");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res) => {
  try {
    const { error, value } = await registerValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    let { name, email, username, password } = await value;

    // username = username.replace(/[^a-zA-Z _]/g, "");
    // username = username.toLowerCase();

    const userAlreadyExist = await User.exists({ email });
    if (userAlreadyExist) {
      return res.status(400).send({
        success: false,
        message:
          "Email is already registered. Please recheck email else login.",
        details: null,
      });
    }

    const usernameAlreadyExist = await User.exists({ username });
    if (usernameAlreadyExist) {
      return res.status(400).send({
        success: false,
        message: "Username is not available. Please choose another username.",
        details: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = await req.body;

    const foundUser = await User.findOne({ email: email.trim() }).select(
      "+password"
    );

    if (!foundUser) {
      return res.status(400).send({
        success: false,
        message:
          "Email isn't registered. Please check your email or register first.",
        details: null,
      });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      return res.status(400).send({
        success: false,
        message: "Wrong password! Please double check your password.",
        details: null,
      });
    }
    const token = await foundUser.generateToken(foundUser._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 900000000,
    });
    res.cookie("userId", foundUser._id.toString(), {
      httpOnly: false,
      maxAge: 900000000,
    });
    res.cookie("isUserLoggedIn", 1, {
      httpOnly: false,
      maxAge: 900000000,
    });
    return res.status(200).send({
      success: true,
      message: "Login successful.",
      details: { token: token },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("isUserLoggedIn", {
      httpOnly: false,
    });
    res.clearCookie("jwt", {
      httpOnly: true,
    });
    res.clearCookie("userId", {
      httpOnly: false,
    });
    return res.status(200).send({
      success: true,
      message: "Logged out successfully",
      details: null,
    });
  } catch (error) {
    res.clearCookie("isUserLoggedIn", {
      httpOnly: false,
    });
    res.clearCookie("userId", {
      httpOnly: false,
    });
    res.clearCookie("jwt", {
      httpOnly: true,
    });
    return res.status(500).send({
      success: false,
      message: "Logged out successfully",
      details: null,
    });
  }
};

module.exports.checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = await req.query;

    const usernameTaken = await User.exists({ username });

    const isValid = /^(?=[a-z0-9_]{3,20}$)(?!.*[_]{2})[^_].*[^_]$/.test(
      username
    );

    if (!isValid) {
      return res.status(400).send({
        success: false,
        message: "Invalid username",
        details: null,
      });
    }

    if (usernameTaken) {
      return res.status(400).send({
        success: false,
        message: "Username is not available. Please try another username.",
        details: null,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Username is available.",
      details: null,
    });
  } catch (error) {}
};

module.exports.fetchUserInfo = async (req, res) => {
  try {
    const { authUserId } = await req;

    if (!authUserId) {
      return res.send({
        success: false,
        message: "Unauthorized request!",
      });
    }
    const u = await User.findById(authUserId)
      .select("name email username bio dob address")
      .lean();
    return res.send({
      success: true,
      message: "Fetch user info successful.",
      details: u,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .send({
        success: false,
        message: "Failed to fetch user info.",
        details: null,
      })
      .status(500);
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { authUserId } = await req;

    if (!authUserId) {
      return res.status(400).send({
        success: false,
        message: "Authentication failed! Please login again.",
        details: null,
      });
    }
    const { error, value } = await updateValidator(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, username, bio, email, dob, address } = await value;

    const updatedUser = await User.findByIdAndUpdate(
      authUserId,
      {
        name,
        username,
        bio,
        email,
        dob,
        address,
      },
      {
        upsert: true,
        new: true,
      }
    ).select("name username email bio dob address");

    res.status(200).send({
      success: true,
      message: "Profile information updated successfully.",
      details: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      message: "Something went wrong ! Please try again.",
      details: null,
    });
  }
};
