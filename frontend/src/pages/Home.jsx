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
    <div className="flex flex-col items-center justify-center h-[74vh] text-center px-4 sm:px-6">
      {!user ? (
        <>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Welcome to the Agora of Olympus
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mb-6">
            Trade legendary relics, enchanted weapons, and ancient artifacts
            discovered by heroes across realms.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-purple-700 text-white rounded cursor-pointer"
            >
              Join the Agora
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border border-purple-700 text-purple-700 rounded cursor-pointer"
            >
              Login
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => navigate("/marketplace")}
            className="w-full sm:w-64 md:w-80 h-auto px-4 sm:px-6 py-3 sm:py-4 bg-pink-600 text-white rounded mb-4 sm:mb-6 cursor-pointer text-xs sm:text-sm md:text-base"
          >
            EXPLORE MARKETPLACE
          </button>

          <button
            onClick={() => navigate("/create-item")}
            className="w-full sm:w-64 md:w-80 h-auto px-4 sm:px-6 py-3 sm:py-4 bg-yellow-400 text-white rounded cursor-pointer text-xs sm:text-sm md:text-base"
          >
            LIST MYTHICAL ITEMS
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
