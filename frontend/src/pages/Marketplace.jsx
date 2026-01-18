import { useEffect, useState } from "react";
import publicAxios from "../utils/publicAxios";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [rarityFilter, setRarityFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await publicAxios.get("/items");
        setItems(res.data);
        setFilteredItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, []);

  
  useEffect(() => {
    let temp = [...items];
    if (categoryFilter) temp = temp.filter(item => item.category === categoryFilter);
    if (rarityFilter) temp = temp.filter(item => item.rarity === rarityFilter);
    setFilteredItems(temp);
  }, [categoryFilter, rarityFilter, items]);

  const categories = [...new Set(items.map(i => i.category))];
  const rarities = [...new Set(items.map(i => i.rarity))];

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#111827] border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value)}
          className="bg-[#111827] border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Rarities</option>
          {rarities.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

     
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item._id}
              onClick={() => navigate(`/items/${item._id}`)}
              className="bg-[#1f2937]/90 border border-gray-700 rounded-lg shadow-lg cursor-pointer hover:shadow-purple-500/50 hover:scale-105 transform transition-all duration-300 overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-44 w-full object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.rarity}</p>
                <p className="text-gray-300 text-sm mt-1">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
