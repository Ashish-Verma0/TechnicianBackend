const techDatabase = require("../model/technician.model");
const bookingDatabase = require("../model/booking.model");

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
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
};
