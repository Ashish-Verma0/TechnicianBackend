const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const techSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
    },

    pinCode: {
      type: String,
      required: true,
    },

    adhar: {
      type: String,
      required: true,
    },

    JobTitle: {
      type: String,
    },

    // designation: {
    //   type: String,
    // },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: Array,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    password: {
      type: String,
    },
    comments: [
      {
        comment: {
          type: String,
        },
        postedBy: { type: String },
      },
    ],
    schedule: [
      {
        startTime: Date,
        endTime: Date,
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

techSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

techSchema.methods.getToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

techSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("techDatabase", techSchema);
