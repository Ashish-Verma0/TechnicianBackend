const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    technicianId: {
      type: String,
      required: true,
    },
    customer: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userDatabase",
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookingDatabase", bookingSchema);
