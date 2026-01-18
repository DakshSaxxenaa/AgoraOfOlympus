import express from "express";
import {
  sendMessage,
  getConversations,
  getMessagesByConversation,
  createOrGetConversation,
} from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.post("/conversation", protect, createOrGetConversation);
router.get("/conversations", protect, getConversations);
router.get("/:conversationId", protect, getMessagesByConversation);

export default router;

