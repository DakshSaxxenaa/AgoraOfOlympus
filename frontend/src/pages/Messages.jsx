import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getConversations,
  createOrGetConversation,
  getMessages,
  sendMessage,
} from "../services/message.service";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const sellerId = searchParams.get("seller");
  const itemId = searchParams.get("item");
  const conversationId = searchParams.get("conversationId");

  const user = JSON.parse(localStorage.getItem("user"))?.user;

  useEffect(() => {
    if (!conversationId) return;

    const loadConv = async () => {
      try {
        const msgs = await getMessages(conversationId);
        setMessages(msgs.data);
        setConversation({ _id: conversationId, participants: [], item: { name: "Item" } });
      } catch (err) {
        console.error("Failed to load conversation:", err);
      } finally {
        setLoading(false);
      }
    };

    loadConv();
  }, [conversationId]);

  
  useEffect(() => {
    if (!sellerId || !itemId || conversationId) return;

    const initChat = async () => {
      try {
        const res = await createOrGetConversation({ sellerId, itemId });
        setConversation(res.data);

        const msgs = await getMessages(res.data._id);
        setMessages(msgs.data);
      } catch (err) {
        console.error("Failed to load chat:", err);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [sellerId, itemId, conversationId]);

  useEffect(() => {
    if (sellerId || itemId || conversationId) return;

    const loadInbox = async () => {
      try {
        const res = await getConversations();
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to load inbox:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInbox();
  }, [sellerId, itemId, conversationId]);

  
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      let payload = { content: text };

      if (conversation?._id) payload.conversationId = conversation._id;
      else payload.itemId = itemId;

      const res = await sendMessage(payload);
      setMessages((prev) => [...prev, res.data]);
      setText("");

      if (!conversation?._id) {
        setConversation({ _id: res.data.conversation });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-300">Loading...</div>;

  
  const getOtherUser = (conv) => {
    if (!conv.participants || !conv.participants.length) return null;
    return conv.participants.find((p) => p._id !== user._id) || conv.participants[0];
  };

  if (!sellerId && !itemId && !conversationId) {
    return (
      <div className="max-w-3xl mx-auto mt-4 sm:mt-6 p-3 sm:p-4 border rounded shadow bg-[#111827] text-white">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Inbox</h2>

        {conversations.length === 0 && (
          <p className="text-gray-400">No conversations yet.</p>
        )}

        <ul className="space-y-3">
          {conversations.map((conv) => {
            const other = getOtherUser(conv);
            if (!other) return null;

            return (
              <li
                key={conv._id}
                className="p-3 border border-gray-700 rounded cursor-pointer hover:bg-[#1f2937]/80 flex justify-between items-center transition"
                onClick={() =>
                  navigate(`/messages?conversationId=${conv._id}`)
                }
              >
                <div className="flex flex-col">
                  <div className="font-medium text-white">
                    {other.username || "Unknown"}
                  </div>
                  {conv.item && (
                    <div className="text-xs text-gray-400 mt-1">
                      Item: {conv.item.name}
                    </div>
                  )}
                </div>
                {conv.item?.image && (
                  <img
                    src={conv.item.image}
                    alt={conv.item.name}
                    className="h-10 w-10 rounded-full object-cover ml-3 border border-gray-600"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  
  const otherUser = conversation?.participants?.find(
    (p) => p._id !== user._id
  ) || conversation?.participants?.[0]; 
  const itemName = conversation?.item?.name || "";
  const itemImage = conversation?.item?.image;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] sm:h-[85vh] flex flex-col border rounded-lg shadow bg-[#111827] text-white overflow-hidden">
      
      <div className="p-3 sm:p-4 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          {itemImage && (
            <img
              src={itemImage}
              alt={itemName}
              className="h-10 w-10 rounded-full object-cover border border-gray-600"
            />
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              {otherUser?.username || "Chat"}
            </h2>
            {itemName && <p className="text-xs sm:text-sm text-gray-400">{itemName}</p>}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#1f2937]/80 min-h-0">
        {messages.length === 0 && (
          <p className="text-center text-gray-400">No messages yet</p>
        )}

        {messages.map((msg) => {
          const senderId =
            typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
          const isMe = senderId === user._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] sm:max-w-xs px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${
                  isMe
                    ? "bg-green-600 text-white"
                    : "bg-[#1f2937] text-gray-200 border border-gray-600"
                }`}
              >
                {msg.content}
                <div className="text-[10px] text-right mt-1 opacity-70 text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      
      <form
        className="p-3 sm:p-4 border-t border-gray-700 flex gap-2"
        onSubmit={handleSend}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-w-0 bg-[#1f2937] text-white text-xs sm:text-sm border border-gray-600 rounded px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-green-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded hover:bg-green-700 transition whitespace-nowrap"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Messages;
