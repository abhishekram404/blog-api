const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    isProduction
      ? "https://abhishekram404-blog-simple.herokuapp.com"
      : "http://localhost:3000"
  );
  res.header("Access-Control-Allow-Credentials", true);

  next();
});

app.use(
  cors({
    origin: isProduction
      ? "https://abhishekram404-blog-simple.herokuapp.com"
      : "http://localhost:3000",
    credentials: true,
    maxAge: "17280000",
  })
);

app.use(cookieParser());
app.use(
  bodyParser.json({
    extended: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  isProduction
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

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", async (req, res) => {
    res.sendFile(__dirname, "client", "build", "index.html");
  });
}

const port = process.env.PORT || 4000;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`🚀  SERVER STARTED ON PORT ${port}`);
});
