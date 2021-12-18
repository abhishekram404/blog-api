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
    },
    address: {
      type: String,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
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
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    userComments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    userLikes: [
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
