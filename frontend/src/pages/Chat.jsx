import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMessages, sendMessage } from "../services/message.service";

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  const auth = JSON.parse(localStorage.getItem("user"));
  const me = auth?.user;

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await getMessages(conversationId);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await sendMessage({
        conversationId,
        content: text,
      });
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      alert("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-300 font-medium tracking-wide">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col rounded-xl shadow-lg bg-[#1f2937]/80 border border-gray-700 backdrop-blur-md">
      
      <div className="p-3 sm:p-4 border-b border-gray-600 flex items-center gap-3 bg-[#111827]/80">
        <button
          onClick={() => navigate(-1)}
          className="text-cyan-400 hover:text-cyan-500 transition font-medium text-sm sm:text-base"
        >
          ← Back
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Chat</h2>
      </div>

      
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#111827]/70">
        {messages.length === 0 && (
          <p className="text-center text-gray-400">No messages yet</p>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender._id === me._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs px-3 sm:px-4 py-2 rounded-xl text-sm shadow-lg ${
                  isMe
                    ? "bg-cyan-500 text-black hover:shadow-cyan-400/40 transition-all"
                    : "bg-gray-800 text-gray-200 border border-gray-600"
                }`}
              >
                {msg.content}
                <div className="text-[10px] text-right mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 border-t border-gray-600 flex gap-2 bg-[#111827]/80"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl px-3 py-2 bg-gray-900/70 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
        />
        <button
          type="submit"
          className="bg-cyan-500 text-black px-4 py-2 rounded-xl font-semibold hover:bg-cyan-400 shadow-lg transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
