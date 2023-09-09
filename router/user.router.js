const express = require("express");
const {
  createUser,
  loginUser,
  userLogin,
} = require("../controller/user.controller");
const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../utils/verifyToken");
const userRouter = express.Router();

const imageUpload = multer({
  limits: 1000000000 * 2000000,
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, "../public/uploadUser"));
    },
    //   fileFilter(file, cb) {
    //     if (!file.originalname.match(/\.(jpg|jpeg|png|gif|eps|raw|cr2|nef|orf|sr2|bmp|tif|tiff)$/)) {
    //         return cb(new Error('Please upload a valid image file'))
    //     }
    //     cb(undefined, true)
    // },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },
  }),
});

userRouter.post("/create", imageUpload.single("avatar"), createUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", verifyToken, userLogin);

module.exports = userRouter;
