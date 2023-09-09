const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const techRouter = require("./router/technician.router");
const bookingRouter = require("./router/booking,router");
const userRouter = require("./router/user.router");
const app = express();
require("dotenv").config();
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "./public/uploadTech")));
app.use("/", express.static(path.join(__dirname, "./public/uploadUser")));

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use("/api/tech", techRouter);
app.use("/api/user", userRouter);
app.use("/api/booking", bookingRouter);

app.use("/", (req, res) => {
  res.send("hello world");
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

module.exports = app;
