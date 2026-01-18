import { useEffect, useState } from "react";
import { getCart, removeFromCart, purchaseCart } from "../services/cart.service";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setItems(items.filter((i) => i._id !== itemId));
      alert("Item removed from cart!");
    } catch (err) {
      console.error("Error removing from cart:", err.response || err);
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const handlePurchase = async () => {
    try {
      await purchaseCart();
      alert("Purchase completed! Items added to your Armory.");
      navigate("/inventory");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-300 tracking-wide text-lg">
        Loading cart...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-white tracking-wide">
        My Cart
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-400 tracking-wide">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-xl p-4 bg-[#1f2937]/80 border border-gray-700 backdrop-blur-md shadow-lg"
              >
                <img
                  src={item.image}
                  className="h-40 w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                  onClick={() => navigate(`/items/${item._id}`)}
                  alt={item.name}
                />

                <h3 className="font-semibold text-lg mt-3 text-white tracking-wide">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-400">{item.rarity}</p>

                <button
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-2 rounded-lg shadow transition"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition"
            onClick={handlePurchase}
          >
            Purchase
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
