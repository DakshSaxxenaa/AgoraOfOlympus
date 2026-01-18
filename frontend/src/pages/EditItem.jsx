import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    category: "",
    rarity: "common",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`/items/${id}`);
        const item = res.data;

        setFormData({
          name: item.name,
          shortDescription: item.shortDescription || "",
          description: item.description,
          category: item.category,
          rarity: item.rarity,
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load item details.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      await axios.put(`/items/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Item updated successfully!");
      navigate(`/marketplace`);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-300 font-medium tracking-wide">
        Loading...
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-xl bg-[#1f2937]/80 border border-gray-700 backdrop-blur-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white text-center tracking-wide">
        Edit Item
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          type="text"
          placeholder="Item Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
          className="w-full rounded-lg px-3 py-2 bg-gray-900/70 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        
        <textarea
          placeholder="Short description (max 150 chars)"
          maxLength={150}
          value={formData.shortDescription}
          onChange={(e) =>
            setFormData({ ...formData, shortDescription: e.target.value })
          }
          className="w-full rounded-lg px-3 py-2 bg-gray-900/70 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        
        <textarea
          placeholder="Full description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          className="w-full rounded-lg px-3 py-2 bg-gray-900/70 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
          className="w-full rounded-lg px-3 py-2 bg-gray-900/70 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        
        <select
          value={formData.rarity}
          onChange={(e) =>
            setFormData({ ...formData, rarity: e.target.value })
          }
          className="w-full rounded-lg px-3 py-2 bg-gray-900/70 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        >
          <option value="common">Common</option>
          <option value="rare">Rare</option>
          <option value="legendary">Legendary</option>
        </select>

        
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-500 rounded-xl cursor-pointer bg-gray-900/50 hover:bg-gray-900/70 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-300">
            <svg
              className="w-10 h-10 mb-3 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16V12M7 12V8M7 12h10m-5-5v10m6 4H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z"
              />
            </svg>

            <p className="mb-2 text-sm">
              <span className="font-semibold text-purple-400">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-gray-400">PNG, JPG or WEBP (MAX. 5MB)</p>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />
        </label>

        {image && (
          <p className="mt-2 text-sm text-green-400">Selected: {image.name}</p>
        )}

        
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-black font-semibold px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            Update Item
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
