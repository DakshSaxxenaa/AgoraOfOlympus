import api from "../utils/axios";


export const getConversations = () =>
  api.get("/messages/conversations");

export const createOrGetConversation = (data) =>
  api.post("/messages/conversation", data);


export const getMessages = (conversationId) =>
  api.get(`/messages/${conversationId}`);

export const sendMessage = (data) =>
  api.post("/messages", data);
