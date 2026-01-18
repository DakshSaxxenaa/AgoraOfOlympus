import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  purchaseCart
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/add/:itemId", addToCart);
router.delete("/remove/:itemId", removeFromCart);
router.post("/purchase", purchaseCart);

export default router;
