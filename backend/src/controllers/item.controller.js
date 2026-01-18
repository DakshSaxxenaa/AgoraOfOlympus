import Item from "../models/Item.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";


function getPublicIdFromUrl(url) {
  const regex = /upload\/(?:v\d+\/)?(.+)(?:\.\w+)$/; 
  const match = url.match(regex);
  return match ? match[1] : null;
}


export const createItem = async (req, res) => {
  try {
    const { name, shortDescription, description, category, rarity } = req.body;

    if (!name || !shortDescription || !description || !category) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const result = await cloudinary.uploader.upload(req.file.path, { folder: "agora-items" });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    const item = await Item.create({
      name,
      shortDescription,
      description,
      category,
      rarity,
      image: result.secure_url,
      seller: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create Item Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getAllItems = async (req, res) => {
  try {
    const { category, rarity } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (rarity) filter.rarity = rarity;

    const items = await Item.find(filter).populate("seller", "username avatar").sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("seller", "username avatar ratingsReceived");

    if (!item) return res.status(404).json({ message: "Item not found" });

    
    const ratings = item.seller.ratingsReceived || []; 
    const avgRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    res.json({
      ...item.toObject(),
      seller: {
        ...item.seller.toObject(),
        avgRating,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch item" });
  }
};


export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user._id })
    .populate("seller", "username avatar");

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to delete this item" });
    }

    
    if (item.image) {
      const publicId = getPublicIdFromUrl(item.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      } else {
        console.warn("Cloudinary publicId could not be extracted:", item.image);
      }
    }

    
    await item.deleteOne();

    return res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete Item Error:", error);
    return res.status(500).json({ message: "Server error while deleting item" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to edit this item" });
    }

    const { name, shortDescription, description, category, rarity } = req.body;
    item.name = name || item.name;
    item.shortDescription = shortDescription || item.shortDescription;
    item.description = description || item.description;
    item.category = category || item.category;
    item.rarity = rarity || item.rarity;

    if (req.file) {
      if (item.image) {
        const oldPublicId = getPublicIdFromUrl(item.image);
        await cloudinary.uploader.destroy(oldPublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, { folder: "agora-items" });
      fs.unlink(req.file.path, (err) => { if (err) console.error("Failed to delete local file:", err); });

      item.image = result.secure_url;
    }

    await item.save();
    res.json(item);
  } catch (error) {
    console.error("Update Item Error:", error);
    res.status(500).json({ message: "Server error while updating item" });
  }
};


export const editItem = updateItem;

