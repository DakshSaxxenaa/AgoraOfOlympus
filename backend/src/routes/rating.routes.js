import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { rateSeller } from "../controllers/rating.controller.js";

const router = express.Router();

router.post("/:sellerId", protect, rateSeller);

export default router;
