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
      alert("Purchase completed! Items added to your Inventory.");
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-6 sm:mt-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white tracking-wide">
        My Cart
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-400 tracking-wide">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ">
            {items.map((item) => (
              <div
                key={item._id}
                className=" sm:w-full  rounded-xl p-4 bg-[#1f2937]/80 border border-gray-700 backdrop-blur-md shadow-lg "
              >
                <img
                  src={item.image}
                  className="h-32 sm:h-40 w-full object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
                  onClick={() => navigate(`/items/${item._id}`)}
                  alt={item.name}
                />

                <h3 className="font-semibold text-lg mt-3 text-white tracking-wide">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-400">{item.rarity}</p>

                <button
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow transition"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            className="mt-6 sm:mt-8 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-semibold px-4 sm:px-8 py-2 sm:py-3 rounded-lg shadow-lg transition"
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
