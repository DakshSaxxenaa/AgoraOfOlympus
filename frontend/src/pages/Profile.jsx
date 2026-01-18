import { useEffect, useState } from "react";
import { getConversations } from "../services/message.service";
import { getMyItems } from "../services/item.service";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [items, setItems] = useState([]);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored).user : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await getMyItems();
        const convoRes = await getConversations();

        setItems(itemsRes.data);
        setConversations(convoRes.data);

        
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#111827] min-h-screen text-white">
      
      <div className="bg-[#1f2937] p-6 rounded shadow mb-8 flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{user?.username}</h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>
      </div>

      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">My Listed Items</h2>
        {items.length === 0 ? (
          <p className="text-gray-400">No items listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-[#1f2937] p-4 rounded shadow hover:bg-[#272c37] transition cursor-pointer"
              >
                <img
                  src={item.image}
                  className="h-40 w-full object-cover rounded"
                />
                <h3 className="font-semibold mt-2 text-white">{item.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Recent Chats</h2>
          <Link to="/messages" className="text-blue-400 hover:underline">
            View All
          </Link>
        </div>

        {conversations.length === 0 ? (
          <p className="text-gray-400">No conversations yet.</p>
        ) : (
          <div className="space-y-3">
            {conversations.map((c) => {
              const other = c.participants.find((p) => p._id !== user._id);
              const itemName = c.item?.name || "Item";
              const itemImage = c.item?.image;

              return (
                <div
                  key={c._id}
                  onClick={() => {
                    if (!other || !c.item?._id) return;
                    navigate(
                      `/messages?seller=${other._id}&item=${c.item._id}`
                    );
                  }}
                  className="bg-[#1f2937] p-4 rounded shadow flex justify-between items-center hover:bg-[#272c37] transition cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-white">{other?.username}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Item: {itemName}
                    </p>
                  </div>
                  {itemImage && (
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="h-10 w-10 rounded-full object-cover ml-4 border border-gray-600"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
