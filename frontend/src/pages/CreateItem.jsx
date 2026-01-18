import { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const CreateItem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    category: "",
    rarity: "common",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.shortDescription ||
      !formData.description ||
      !formData.category ||
      !image
    ) {
      alert("Please fill all required fields and select an image.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      data.append("image", image);

      await axios.post("/items", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Item listed successfully!");
      navigate("/marketplace");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 rounded-xl bg-[#1f2937]/80 border border-gray-700 backdrop-blur-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white text-center tracking-wide">
        List a New Item
      </h2>

      <form onSubmit={submitHandler} className="space-y-4">
        
        <input
          type="text"
          placeholder="Item name"
          className="w-full rounded-lg px-3 py-2 bg-gray-900/70 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <textarea
          placeholder="Short description (max 150 chars)"
          maxLength={150}
          className="w-full rounded-lg px-3 py-2 bg-gray-900/70 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          value={formData.shortDescription}
          onChange={(e) =>
            setFormData({ ...formData, shortDescription: e.target.value })
          }
        />

        
        <textarea
          placeholder="Full description"
          className="w-full rounded-lg px-3 py-2 bg-gray-900/70 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        
        <input
          type="text"
          placeholder="Category"
          className="w-full rounded-lg px-3 py-2 bg-gray-900/70 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />

        
        <select
          className="w-full rounded-lg px-3 py-2 bg-gray-900/70 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          value={formData.rarity}
          onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
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

        
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded-xl font-semibold text-black bg-purple-600 hover:bg-purple-500 shadow-lg transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Create Item"}
        </button>
      </form>
    </div>
  );
};

export default CreateItem;
