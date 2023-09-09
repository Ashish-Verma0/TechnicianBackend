const techDatabase = require("../model/technician.model");
const bookingDatabase = require("../model/booking.model");
const BookingComplete = require("../model/bookingCompleteOtp.model");
const userDatabase = require("../model/user.model");
const sendEmail = require("../utils/sendEmail");

const createBooking = async (req, res, next) => {
  try {
    const { technicianId, startTime, endTime } = req.body;

    // Check if technician is available at the specified time
    const technician = await techDatabase.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    const overlappingBooking = technician.schedule.find((booking) => {
      return (
        booking.startTime < new Date(endTime) &&
        booking.endTime > new Date(startTime)
      );
    });

    if (overlappingBooking) {
      return res
        .status(400)
        .json({ message: "Technician is not available at the specified time" });
    }

    // Create new booking
    const booking = await bookingDatabase.create({
      technicianId: technicianId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      customer: req.user.id,
    });

    // Add booking to technician's schedule
    technician.schedule.push({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });
    await technician.save();

    res.json({ message: "Booking successful", booking });
    console.log(booking._id);
    await sendEmail({
      email: technician?.email,
      subject: `User Booking Details`,
      message: `your Booking Customer Id is ${booking?._id}`,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBooking = async (req, res, next) => {
  try {
    const bookings = await bookingDatabase.find({ customer: req.user.id });
    console.log(bookings);
    if (!bookings) {
      res.status(404).json({
        success: false,
        message: "You have no booking",
      });
    }

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

const BookingCompleteOtp = async (req, res, next) => {
  try {
    const user = await userDatabase.findById(req.user.id);
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Save the OTP and its expiration time to the database
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    const otpData = await BookingComplete.create({
      userId: req.user.id,
      otp: otp,
      expiresIn: expirationTime,
    });

    res.status(200).json({
      success: true,
      message: "Otp send successfully",
      data: otpData,
    });
    await sendEmail({
      email: user?.email,
      subject: `Verifying Otp Code`,
      message: `your Booking code otp code is ${otp}`,
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const otp = await BookingComplete.findOne({ otp: req.body.otp });

    if (!otp) {
      res.status(404).json({
        success: false,
        message: "Invalid otp",
      });
    }

    const updateQuery = await bookingDatabase.findByIdAndUpdate(
      req.body.bookingId,
      { resolved: true },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Scheduled copleted",
      data: updateQuery,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createBooking,
  BookingCompleteOtp,
  verifyOtp,
  getAllBooking,
};
