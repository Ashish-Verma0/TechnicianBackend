const express = require("express");
const path = require("path");
const multer = require("multer");
const {
  createTechnician,
  loginTechnician,
  technicianProfile,
  updateTechnician,
  findTechnicianById,
  updatePassword,
  verifyEmail,
  verifyTechOtp,
  forgotPassword,
  getAllTech,
  postComment,
  updateComment,
  deleteComment,
} = require("../controller/technician.controller");
const { verifyToken, verifyIsAdmin } = require("../utils/verifyToken");
const techRouter = express.Router();

const imageUplaod = multer({
  limits: 1000000000 * 2000000,
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, "../public/uploadTech"));
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

techRouter.post("/create", imageUplaod.single("adhar"), createTechnician);
techRouter.post("/login", loginTechnician);
techRouter.get("/all/tech", getAllTech);
techRouter.get("/me", verifyToken, technicianProfile);
techRouter.post("/comment/:techId", verifyToken, postComment);
techRouter.post("/comment/:techId/:commentId", verifyToken, deleteComment);
techRouter.put("/comment/:techId/:commentId", verifyToken, updateComment);
techRouter.get("/:id", findTechnicianById);
techRouter.put(
  "/update",
  imageUplaod.single("avatar"),
  verifyToken,
  updateTechnician
);
techRouter.put(
  "/update/password",

  verifyToken,
  updatePassword
);
techRouter.post(
  "/verify/email",

  verifyEmail
);
techRouter.post(
  "/verify/otp",

  verifyTechOtp
);
techRouter.put(
  "/forgot/password",

  forgotPassword
);

module.exports = techRouter;
