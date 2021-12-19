const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();
const allowedOrigins = [
  "https://blog-eight-roan-16.vercel.app/",
  "https://blog-6dkd0r3wd-abhishekram404.vercel.app/",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    maxAge: "17280000",
  })
);
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    // ""
    "https://blog-6dkd0r3wd-abhishekram404.vercel.app/"
  );
  // res.setHeader("Access-Control-Allow-Credentials", true);
  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  // );
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "X-Requested-With,content-type"
  // );
  next();
});
app.use(cookieParser());
app.use(
  bodyParser.json({
    extended: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  process.env.NODE_ENV === "production"
    ? `mongodb+srv://blogadmin:${process.env.MONGO_PASS}@blog.vxoiw.mongodb.net/blog?retryWrites=true&w=majority`
    : process.env.MONGO_URI || "mongodb://localhost:27017/blog",
  (err) => {
    if (err) {
      console.log("🔴 Error connecting to database");
      console.log(err.message);
      return;
    }
    console.log("✅  Connected to database");
  }
);
// app.use(express.static(__dirname + "/app/build/"));
// if (process.env.NODE_ENV === "production") {
//   app.get("*", (req, res) => {
//     res.sendFile(__dirname + "/app/build/index.html");
//   });
//   // return;
// }

app.get("/", (req, res) => res.send("Server is working fine."));
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

const port = process.env.PORT || 4000;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`🚀  SERVER STARTED ON PORT ${port}`);
});
