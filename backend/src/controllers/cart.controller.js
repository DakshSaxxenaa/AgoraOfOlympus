import User from "../models/User.model.js";

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "cart",
      populate: { path: "seller", select: "username" }
    });

    return res.json(user.cart || []);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const addToCart = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const user = await User.findById(req.user._id);

    
    if (user.cart.some(id => id.toString() === itemId)) {
      return res.status(400).json({ message: "Item already in cart" });
    }

    user.cart.push(itemId);
    await user.save();

    return res.json({ message: "Item added to cart" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(id => id.toString() !== itemId);
    await user.save();

    return res.json({ message: "Item removed from cart" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const purchaseCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.cart || !Array.isArray(user.cart)) user.cart = [];
    if (!user.inventory || !Array.isArray(user.inventory)) user.inventory = [];

    const uniqueCartIds = [...new Set(user.cart.map(id => id.toString()))];

    uniqueCartIds.forEach(itemId => {
    const alreadyInInventory = user.inventory.some(
        inv => inv.item && inv.item.toString() === itemId
    );

    if (!alreadyInInventory) {
        user.inventory.push({ item: itemId, rated: false, rating: 0 });
    }
    });

    
    user.cart = [];

    await user.save();

    res.json({ message: "Purchase successful" });
  } catch (err) {
    console.error("Purchase Error:", err);
    res.status(500).json({ message: err.message });
  }
};


