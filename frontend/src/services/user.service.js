import api from "../utils/axios";
import axios from "../utils/axios";

export const getCart = () => api.get("/user/cart");

export const addToCart = (itemId) =>
  api.post(`/user/cart/${itemId}`);

export const removeFromCart = (itemId) =>
  api.delete(`/user/cart/${itemId}`);

export const purchaseCart = () =>
  api.post("/user/cart/purchase");

export const getInventory = () =>
  api.get("/user/inventory");

export const rateSeller = (sellerId, rating) =>
  api.post(`/user/rate/${sellerId}`, { rating });

export const updateProfileAvatar = async (formData) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  if (!token) throw new Error("User not logged in");

  return axios.post("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
