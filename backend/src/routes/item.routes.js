import express from "express";
import {
  createItem,
  getAllItems,
  getItemById,
  getMyItems,
  deleteItem,
  updateItem
} from "../controllers/item.controller.js"; 
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();


router.get("/", getAllItems);
router.get("/my", protect, getMyItems);

router.get("/:id", getItemById);



router.post("/", protect, upload.single("image"), createItem);
router.put("/:id", protect, upload.single("image"), updateItem);
router.delete("/:id", protect, deleteItem);

export default router;
