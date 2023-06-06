const techDatabase = require("../model/technician.model");
const createError = require("../utils/errorHandler");
const sendToken = require("../utils/sendToken");
const techOtpDatabase = require("../model/techOtp.model");
const ApiFeatures = require("../utils/apiFeatures");

const createTechnician = async (req, res, next) => {
  try {
    const tech = await techDatabase.create({
      ...req.body,
      // avatar: req.file.filename,
      adhar: req.file.filename,
    });
    if (!tech) {
      return next(createError(500, "something went wrong"));
    }

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      data: tech,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTech = async (req, res, next) => {
  try {
    const resultPerPage = 8;

    const apiFeatures = new ApiFeatures(techDatabase.find(), req.query)
      .search()
      .pagination(resultPerPage);
    const tech = await apiFeatures.query;

    if (!tech) {
      return next(createError(404, "No Data Found"));
    }

    res.status(200).json({
      success: true,
      message: "Data found successfully",
      data: tech,
    });
  } catch (error) {
    next(error);
  }
};

const loginTechnician = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const tech = await techDatabase.findOne({ email }).select("+password");

    const isPassword = await tech.comparePassword(password);
    if (!tech || !isPassword) {
      return next(createError(404, "User Not Found"));
    }

    sendToken(tech, 200, res);
  } catch (error) {
    next(error);
  }
};

const technicianProfile = async (req, res, next) => {
  try {
    const tech = await techDatabase.findById(req.user.id);

    if (!tech) {
      return next(404, "user not login");
    }

    res.status(200).json({
      success: true,
      message: "Technician Login Successfully",
      data: tech,
    });
  } catch (error) {
    next(error);
  }
};

const updateTechnician = async (req, res, next) => {
  try {
    const tech = await techDatabase.findByIdAndUpdate(
      req.user.id,
      { ...req.body, avatar: req.file.filename },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "technician update successfully",
      data: tech,
    });
  } catch (error) {
    next(error);
  }
};

const findTechnicianById = async (req, res, next) => {
  try {
    const tech = await techDatabase.findById(req.params.id);

    if (!tech) {
      return next(createError(404, "Technician not found with this id"));
    }

    res.status(200).json({
      success: true,
      message: "Successfully Find Technician",
      data: tech,
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const tech = await techDatabase.findById(req.user.id).select("+password");
    const isPasswordMatched = await tech.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
      return next(createError(404, "oldPassword is not matched"));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(
        createError(404, "Password and confirmPassword is not matched")
      );
    }
    tech.password = req.body.newPassword;
    await tech.save();

    res.status(200).json({
      success: true,
      message: "password update successfully",
      data: tech,
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const tech = await techDatabase.findOne({ email });

    if (!tech) {
      return next(createError(404, "email not exists"));
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    // Save the OTP and its expiration time to the database
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    const otpData = await techOtpDatabase.create({
      otp: otp,
      email,
      expiresIn: expirationTime,
    });

    res.status(200).json({
      success: true,
      message: "Email verify successfully",
      data: otpData,
    });
  } catch (error) {
    next(error);
  }
};

const verifyTechOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const otpData = await techOtpDatabase.findOne({ otp });
    if (!otpData) {
      return next(createError(404, "Otp not matched"));
    }

    if (
      otpData.otp === otp &&
      Date.now() - otpData.expiresIn <= 10 * 60 * 1000
    ) {
      res.status(200).json({
        success: true,
        message: "OTP verification successful",
      });
    } else {
      return next(createError(404, "Otp Time Over "));
    }
  } catch (error) {
    return error;
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await techDatabase.findOne({ email });

    if (!data) {
      return next(createError(404, "please try again from start"));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(
        createError(404, "password and confirmPassword are not matched")
      );
    }
    data.password = req.body.newPassword;
    await data.save();

    res.status(200).json({
      success: true,
      message: "password Reset Successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTechnician,
  getAllTech,
  loginTechnician,
  technicianProfile,
  updateTechnician,
  findTechnicianById,
  updatePassword,
  verifyEmail,
  verifyTechOtp,
  forgotPassword,
};
