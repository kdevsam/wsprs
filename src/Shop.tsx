import { useNavigate } from "react-router-dom";

function Shop() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-8">Nothing here yet</h1>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-indigo-600 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all"
      >
        Back to Home
      </button>

      {/* Add your shop items here */}
    </div>
  );
}

export default Shop;
