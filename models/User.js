const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    bio: {
      type: String,
      required: false,
      maxlength: 300,
      default: "",
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    dob: {
      type: Date,
      required: false,
      default: "",
    },
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 256,
      select: false,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "joined",
    },
  }
);

userSchema.methods.generateToken = (id) => {
  return jwt.sign(
    {
      _id: id,
    },
    process.env.JWT_SECRET || "VERYSECRETANDSTRONGKEY"
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;
