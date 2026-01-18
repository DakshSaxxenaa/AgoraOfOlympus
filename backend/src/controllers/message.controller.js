import Message from "../models/Message.model.js";
import Item from "../models/Item.model.js";
import Conversation from "../models/Conversation.model.js";


export const sendMessage = async (req, res) => {
  try {
    const { itemId, content, conversationId } = req.body;

    if (!content || (!itemId && !conversationId)) {
      return res.status(400).json({ message: "Item or conversation and message are required" });
    }

    let conversation;
    let item;

    if (conversationId) {
      
      conversation = await Conversation.findById(conversationId).populate("participants").populate("item");
      if (!conversation) return res.status(404).json({ message: "Conversation not found" });

      item = conversation.item;
    } else {
      
      if (!itemId) return res.status(400).json({ message: "Item ID required" });

      item = await Item.findById(itemId).populate("seller");
      if (!item) return res.status(404).json({ message: "Item not found" });

      
      if (item.seller._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: "You cannot message yourself" });
      }

      conversation = await Conversation.findOne({
        item: item._id,
        participants: { $all: [req.user._id, item.seller._id] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          item: item._id,
          participants: [req.user._id, item.seller._id],
        });
      }
    }

    
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      content,
    });

    
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getConversations = async (req, res) => {
  try {
    
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "username avatar")
      .populate("item", "name image")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username avatar" },
      })
      .sort({ updatedAt: -1 });

    
    res.json(conversations);
  } catch (error) {
    console.error("Get Conversations Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createOrGetConversation = async (req, res) => {
  try {
    const { sellerId, itemId } = req.body;

    if (!sellerId || !itemId) {
      return res.status(400).json({ message: "Missing sellerId or itemId" });
    }

    
    let conversation = await Conversation.findOneAndUpdate(
      {
        item: itemId,
        participants: { $all: [req.user._id, sellerId] }
      },
      {
        $setOnInsert: {
          item: itemId,
          participants: [req.user._id, sellerId]
        }
      },
      { new: true, upsert: true }
    ).populate("participants", "username");

    await conversation.populate("participants", "username");

    res.json(conversation);
  } catch (err) {
    console.error("CreateOrGetConversation Error:", err);
    res.status(500).json({ message: err.message });
  }
};
