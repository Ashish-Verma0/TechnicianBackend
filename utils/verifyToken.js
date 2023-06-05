const jwt = require("jsonwebtoken");
const createError = require("./errorHandler");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(createError(401, "You are not authenticated"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError(401, "Token is not valid"));
    }
    req.user = user;

    next();
  });
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(401, "You are not authorized"));
    }
  });
};
const verifyIsAdmin = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(createError(401, "You are not authenticated"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError(401, "Token is not valid"));
    }
    req.user = user;

    if (user.isAdmin) {
      next();
    } else {
      return next(createError(401, "You are not Admin"));
    }
  });
};

module.exports = {
  verifyIsAdmin,
  verifyToken,
  verifyUser,
};
