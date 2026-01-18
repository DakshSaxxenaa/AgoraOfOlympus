import api from "./axios";

export const getMyItems = () => {
  return api.get("/items/my");
};
