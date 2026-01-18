import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { getWishlist, addToWishlist, removeFromWishlist } from "../services/wishlist.service";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [addingWishlist, setAddingWishlist] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load item.");
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await getWishlist();
        setWishlist(res.data.map(i => i._id));
      } catch (err) {
        console.error(err);
      }
    };

    fetchItem();
    fetchWishlist();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!user) return alert("Please login first.");
    try {
      setAddingWishlist(true);
      if (wishlist.includes(item._id)) {
        await removeFromWishlist(item._id);
        setWishlist(wishlist.filter(i => i !== item._id));
      } else {
        await addToWishlist(item._id);
        setWishlist([...wishlist, item._id]);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update wishlist");
    } finally {
      setAddingWishlist(false);
    }
  };

  const addToCart = async () => {
    if (!user) return alert("Please login first.");
    try {
      await axios.post(`/cart/add/${item._id}`);
      alert("Item added to cart!");
      if (wishlist.includes(item._id)) {
        await removeFromWishlist(item._id);
        setWishlist(wishlist.filter(i => i !== item._id));
      }
    } catch (err) {
      console.error("Error adding to cart:", err.response || err);
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleContactSeller = () => {
    navigate(`/messages?item=${item._id}&seller=${item.seller._id}`);
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-300 font-medium">Loading...</div>;
  if (!item) return <div className="text-center mt-20 text-gray-300">Item not found.</div>;

  const wished = wishlist.includes(item._id);
  const stored = JSON.parse(localStorage.getItem("user"));
  const userId = stored?.user?._id;
  const sellerId = item?.seller?._id;
  const isOwner = userId && sellerId && userId.toString() === sellerId.toString();

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-[#1f2937]/80 backdrop-blur-lg rounded-xl shadow-lg text-white">
      
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-64 object-cover rounded-lg mb-4 border-2 border-purple-700"
      />


      <h2 className="text-3xl font-bold mb-2">{item.name}</h2>
      <p className="text-sm text-gray-400 mb-2">{item.category} | {item.rarity}</p>
      <p className="mb-4 text-gray-200">{item.description}</p>


      {isOwner && (
        <div className="flex gap-3 mb-4 flex-wrap">
          <button
            onClick={() => navigate(`/edit-item/${item._id}`)}
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2 rounded-lg transition-all"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure?")) {
                axios.delete(`/items/${id}`).then(() => navigate("/profile"));
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-all"
          >
            Delete
          </button>
        </div>
      )}


      {!isOwner && (
        <div className="flex gap-3 flex-wrap items-center mb-4">
          <button
            onClick={handleContactSeller}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition-all"
          >
            Contact Seller
          </button>
          <button
            onClick={addToCart}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-all"
          >
            Add to Cart
          </button>
          <button
            onClick={handleWishlistToggle}
            disabled={addingWishlist}
            className="ml-auto text-3xl cursor-pointer"
          >
            {wished ? (
              <AiFillHeart className="text-red-500 hover:text-red-400 transition-all" />
            ) : (
              <AiOutlineHeart className="text-gray-500 hover:text-red-500 transition-all" />
            )}
          </button>
        </div>
      )}

      
      <div className="mt-6 p-4 bg-[#111827]/80 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {!isOwner ? (
            <p className="text-gray-300 text-sm">
              Seller: <span className="text-purple-400 font-medium">{item.seller.username}</span>
            </p>
          ) : (
            <p className="text-gray-400 text-sm font-medium">Owner</p>
          )}
        </div>

      
        {item.seller.avgRating && (
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                className={`text-xl ${
                  star <= Math.round(item.seller.avgRating)
                    ? "text-yellow-400"
                    : "text-gray-600"
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-1 text-gray-400 text-sm">
              ({item.seller.avgRating.toFixed(1)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
