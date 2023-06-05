const userDatabase = require("../model/user.model");
const createError = require("../utils/errorHandler");
const sendToken = require("../utils/sendToken");

const createUser = async (req, res, next) => {
  try {
    const user = await userDatabase.create({
      ...req.body,
      avatar: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userDatabase.findOne({ email }).select("+password");

    if (!user) {
      return next(createError(404, "User Not Found"));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(createError(404, "User Not Found"));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const user = await userDatabase.findById(req.user.id);

    if (!user) {
      return next(createError(404, "user not found"));
    }

    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createUser,
  loginUser,
  userLogin,
};
