import api from "../utils/axios";

export const getInventory = () => api.get("/inventory");
export const addToInventory = (itemId) => api.post("/inventory", { itemId });
export const removeFromInventory = (itemId) => api.delete(`/inventory/${itemId}`);
