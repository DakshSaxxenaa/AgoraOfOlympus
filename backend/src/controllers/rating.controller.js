import User from "../models/User.model.js";

export const rateSeller = async (req, res) => {
  try {
    const { rating } = req.body;
    const sellerId = req.params.sellerId;
    const userId = req.user._id;

    const seller = await User.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    
    const existing = seller.ratingsReceived.find(r => r.from.toString() === userId.toString());
    if (existing) {
      existing.rating = rating; 
    } else {
      seller.ratingsReceived.push({ from: userId, rating });
    }

    await seller.save();

    return res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("Rate Seller Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

