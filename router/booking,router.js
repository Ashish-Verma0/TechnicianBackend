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
bookingRouter.post("/create/otp", verifyToken, BookingCompleteOtp);
bookingRouter.post("/verify/otp", verifyToken, verifyOtp);
bookingRouter.get("/all/booking", verifyToken, getAllBooking);

module.exports = bookingRouter;
