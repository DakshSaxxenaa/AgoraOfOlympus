import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[74 vh] text-center">
      {!user ? (
        <>
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the Agora of Olympus
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mb-6">
            Trade legendary relics, enchanted weapons, and ancient artifacts
            discovered by heroes across realms.
          </p>

          <div className="space-x-4">
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-purple-700 text-white rounded cursor-pointer"
            >
              Join the Agora
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 border border-purple-700 text-purple-700 rounded cursor-pointer"
            >
              Login
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => navigate("/marketplace")}
            className="w-200 h-30 px-6 py-3 bg-pink-600 text-white rounded mb-6 cursor-pointer"
          >
            EXPLORE MARKETPLACE
          </button>

          <button
            onClick={() => navigate("/create-item")}
            className="w-200 h-30 px-6 py-3 bg-yellow-400 text-white rounded cursor-pointer"
          >
            LIST MYTHICAL ITEMS
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
