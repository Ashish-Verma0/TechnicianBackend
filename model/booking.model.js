const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  technicianId: {
    type: String,
    required: true,
  },
  customer: {
    type: String,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
});

module.exports = mongoose.model("bookingDatabase", bookingSchema);
