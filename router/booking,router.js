const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const { createBooking } = require("../controller/booking.controller");

const bookingRouter = express.Router();

bookingRouter.post("/create", verifyToken, createBooking);

module.exports = bookingRouter;
