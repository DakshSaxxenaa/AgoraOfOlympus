import React from "react";
import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../services/wishlist.service";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await getWishlist();
        setItems(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const moveToCart = async (itemId) => {
    if (!user) return alert("Please login first.");
    try {
      await axios.post(`/cart/add/${itemId}`);
      await removeFromWishlist(itemId);
      setItems(items.filter(i => i._id !== itemId));
      alert("Item moved to cart!");
    } catch (err) {
      console.error("Error moving item to cart:", err.response || err);
      alert(err.response?.data?.message || "Failed to move to cart");
    }
  };

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">My Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-gray-400">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item._id} className="w-[90%] sm:w-full mx-auto bg-[#1f2937] p-4 rounded shadow text-white">
              <img
                src={item.image}
                className="h-32 sm:h-40 w-full object-contain rounded cursor-pointer"
                onClick={() => navigate(`/items/${item._id}`)}
              />
              <h3 className="font-semibold mt-2 text-sm sm:text-base">{item.name}</h3>
              <p className="text-xs sm:text-sm text-gray-300">{item.rarity}</p>
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => moveToCart(item._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded transition"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
