import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setAuth(JSON.parse(stored));
    } catch {
      localStorage.removeItem("user");
      setAuth(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setAuth(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="w-full flex flex-wrap justify-between items-center px-4 sm:px-8 py-4 bg-[#0F0F14] text-gray-200 border-b border-gray-800">
      <h1
        className="text-base sm:text-xl md:text-2xl font-extrabold tracking-wide text-cyan-400 drop-shadow-[0_0_6px_#00eaff] cursor-pointer uppercase"
        onClick={() => navigate("/")}
      >
        Agora of Olympus
      </h1>

      {auth && (
        <>
          <button
            className="lg:hidden text-cyan-400 text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div className={`${menuOpen ? "flex" : "hidden"} lg:flex flex-col lg:flex-row w-full lg:w-auto mt-4 lg:mt-0 space-y-2 lg:space-y-0 lg:space-x-5 text-xs sm:text-sm font-semibold`}>
            <button onClick={() => { navigate("/"); setMenuOpen(false); }} className="hover:text-cyan-400 transition">Home</button>
            <button onClick={() => { navigate("/profile"); setMenuOpen(false); }} className="hover:text-cyan-400 transition">Profile</button>
            <button onClick={() => { navigate("/inventory"); setMenuOpen(false); }} className="hover:text-cyan-400 transition">Inventory</button>
            <button onClick={() => { navigate("/wishlist"); setMenuOpen(false); }} className="hover:text-cyan-400 transition">Wishlist</button>
            <button onClick={() => { navigate("/messages"); setMenuOpen(false); }} className="hover:text-cyan-400 transition">Messages</button>
            <button onClick={() => { navigate("/cart"); setMenuOpen(false); }} className="hover:text-cyan-400 transition">Cart</button>

            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
