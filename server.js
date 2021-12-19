const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();
// const allowedOrigins = [
//   "https://blog-eight-roan-16.vercel.app/",
//   "https://blog-6dkd0r3wd-abhishekram404.vercel.app/",
// ];

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://blog-git-development-abhishekram404.vercel.app"
  );
  res.header("Access-Control-Allow-Credentials", true);

  next();
});

app.use(
  cors({
    origin: "https://blog-git-development-abhishekram404.vercel.app",
    credentials: true,
    maxAge: "17280000",
  })
);

// app.options("*", cors());

// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     // ""
//     "https://blog-6dkd0r3wd-abhishekram404.vercel.app/"
//   );

//   // res.setHeader("Access-Control-Allow-Credentials", true);
//   // res.setHeader(
//   //   "Access-Control-Allow-Methods",
//   //   "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   // );
//   // res.setHeader(
//   //   "Access-Control-Allow-Headers",
//   //   "X-Requested-With,content-type"
//   // );
//   next();
// });

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

app.get("/", (req, res) => res.send("Server is working fine."));
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

const port = process.env.PORT || 4000;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`🚀  SERVER STARTED ON PORT ${port}`);
});
