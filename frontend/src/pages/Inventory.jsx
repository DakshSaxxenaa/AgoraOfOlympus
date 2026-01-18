import { useEffect, useState } from "react";
import { getInventory, removeFromInventory } from "../services/inventory.service";
import axios from "../utils/axios";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});

  const fetchInventory = async () => {
    try {
      const res = await getInventory();
      setItems(res.data);

      const initialRatings = {};
      res.data.forEach(it => {
        initialRatings[it._id] = it.userRating || 0;
      });
      setRatings(initialRatings);
    } catch (err) {
      console.error("Fetch Inventory Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromInventory(id);
      setItems(prev => prev.filter(item => item._id !== id));
      const newRatings = { ...ratings };
      delete newRatings[id];
      setRatings(newRatings);
    } catch (err) {
      console.error("Remove Inventory Error:", err);
    }
  };

  const submitRating = async (sellerId, itemId, ratingValue) => {
    try {
      await axios.post(`/rating/${sellerId}`, { rating: ratingValue });
      setRatings(prev => ({ ...prev, [itemId]: ratingValue }));
    } catch (err) {
      console.error("Rating Error:", err);
      alert("Rating failed");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-300 font-medium tracking-wide">
        Loading...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white tracking-wide">
        My Inventory
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-400">No items in your Inventory yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, idx) => (
            <div
              key={`${item._id}-${idx}`}
              className="w-[90%] sm:w-full mx-auto bg-[#1f2937]/80 border border-gray-700 backdrop-blur-lg rounded-xl p-4 shadow-lg transition hover:scale-[1.02]"
            >
              
              <img
                src={item.image}
                alt={item.name}
                className="h-32 sm:h-40 w-full object-contain rounded-lg mb-3"
              />

              <h3 className="font-semibold text-white text-base sm:text-lg">{item.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{item.rarity}</p>

              <p className="text-sm text-gray-300 mb-2">
                Seller: <span className="font-medium text-purple-400">{item.seller?.username || "Unknown"}</span>
              </p>

              <div className="flex space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`text-2xl cursor-pointer ${
                      (ratings[item._id] || 0) >= star
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-gray-600 hover:text-yellow-400"
                    } transition-all`}
                    onMouseEnter={() =>
                      setRatings(prev => ({ ...prev, [item._id]: star }))
                    }
                    onMouseLeave={() =>
                      setRatings(prev => ({ ...prev, [item._id]: prev[item._id] || 0 }))
                    }
                    onClick={() =>
                      submitRating(item.seller._id, item._id, star)
                    }
                  >
                    ★
                  </span>
                ))}
              </div>


              <button
                onClick={() => handleRemove(item._id)}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg transition-all"
              >
                Remove from Inventory
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
