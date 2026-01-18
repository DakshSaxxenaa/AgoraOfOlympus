import User from "../models/User.model.js";
import Item from "../models/Item.model.js";

export const getInventory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "inventory.item",
      populate: {
        path: "seller",
        select: "username reputation ratingsReceived"
      }
    });

    const inventoryData = user.inventory
      .filter(inv => inv.item) 
      .map(inv => {
        const seller = inv.item.seller;
        const userRatingObj = seller?.ratingsReceived?.find(
          r => r.from.toString() === req.user._id.toString()
        );

        return {
          _id: inv.item._id,
          name: inv.item.name,
          image: inv.item.image,
          rarity: inv.item.rarity,
          seller: seller
            ? {
                _id: seller._id,
                username: seller.username,
                reputation: seller.reputation
              }
            : null,
          userRating: userRatingObj ? userRatingObj.rating : 0
        };
      });

    res.json(inventoryData);
  } catch (err) {
    console.error("Get Inventory Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const addToInventory = async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const user = await User.findById(req.user._id);
    if (user.inventory.includes(itemId)) {
      return res.status(400).json({ message: "Item already in inventory" });
    }

    user.inventory.push(itemId);
    await user.save();
    res.json({ message: "Item added to inventory", inventory: user.inventory });
  } catch (err) {
    console.error("Add To Inventory Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromInventory = async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    
    if (!Array.isArray(user.inventory)) user.inventory = [];

    
    user.inventory = user.inventory.filter(inv => {
      
      const id = inv.item ? inv.item.toString() : inv.toString();
      return id !== itemId;
    });

    await user.save();

    res.json({ message: "Item removed from inventory", inventory: user.inventory });
  } catch (err) {
    console.error("Remove From Inventory Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};