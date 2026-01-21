import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/item.routes.js";
import messageRoutes from "./routes/message.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import userRoutes from "./routes/user.routes.js";
import fs from "fs";
import path from "path";



  dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
  });

connectDB();

const app = express();


app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://agoraofolympus.netlify.app",

    credentials: true,
  })
);


app.get("/", (req, res) => {
  res.send("Agora of Olympus API is running...");
});

const avatarsPath = path.join(process.cwd(), "uploads/avatars");
if (!fs.existsSync(avatarsPath)) {
  fs.mkdirSync(avatarsPath, { recursive: true });
}


app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes); 


app.use("/uploads", express.static("uploads"));
app.use("/api/inventory", inventoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/rating", ratingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
