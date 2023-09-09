const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const {
  createBooking,
  BookingCompleteOtp,
  verifyOtp,
  getAllBooking,
} = require("../controller/booking.controller");

const bookingRouter = express.Router();

bookingRouter.post("/create", verifyToken, createBooking);
bookingRouter.get("/create/otp", verifyToken, BookingCompleteOtp);
bookingRouter.post("/verify/otp", verifyToken, verifyOtp);
bookingRouter.get("/all", verifyToken, getAllBooking);

module.exports = bookingRouter;
