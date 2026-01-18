import axios from "../utils/axios";

export const getCart = () => axios.get("/cart");
export const addToCart = (itemId) => axios.post(`/cart/${itemId}`);
export const removeFromCart = (itemId) => axios.delete(`/cart/remove/${itemId}`);
export const purchaseCart = () => axios.post("/cart/purchase");
