import express from "express";
import {
  getInventory,
  addToInventory,
  removeFromInventory
} from "../controllers/inventory.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getInventory);
router.post("/", protect, addToInventory);
router.delete("/:itemId", protect, removeFromInventory);

export default router;
