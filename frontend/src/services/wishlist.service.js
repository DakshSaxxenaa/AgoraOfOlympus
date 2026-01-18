
import axios from "../utils/axios";

export const getWishlist = () => axios.get("/wishlist");

export const addToWishlist = (itemId) =>
  axios.post("/wishlist", { itemId });

export const removeFromWishlist = (itemId) =>
  axios.delete(`/wishlist/${itemId}`);
