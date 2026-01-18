import User from "../models/User.model.js";

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error("Avatar update error:", err);
    res.status(500).json({ message: "Failed to update avatar" });
  }
};
