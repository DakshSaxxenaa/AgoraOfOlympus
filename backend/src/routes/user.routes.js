import express from "express";
import multer from "multer";

import { protect } from "../middlewares/auth.middleware.js";
import { updateAvatar } from "../controllers/user.controller.js";
import path from "path";

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/avatars"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });


router.post("/avatar", protect, upload.single("avatar"), updateAvatar);

export default router;
