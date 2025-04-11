import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const fetchRecipes = async (query = "") => {
    try {
      const res = await axios.get(`/api/recipes${query ? `?q=${query}` : ""}`);
      setRecipes(res.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    setSearch(query);
    fetchRecipes(query);
  }, [location]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      try {
        await axios.delete(`/api/recipes/${id}`);
        fetchRecipes(search);
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?q=${search}`);
    fetchRecipes(search);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🍴 Recipe Finder</h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row justify-center mb-6 gap-2"
      >
        <input
          type="text"
          placeholder="Search by name, ingredient or cuisine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-500">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition duration-300"
            >
              <img
                src={recipe.image || "https://via.placeholder.com/400"}
                alt={recipe.title}
                className="h-60 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{recipe.title}</h2>
                <p className="text-gray-500 text-sm mb-2">{recipe.cuisine}</p>

                {/* Action Buttons */}
                <div className="flex justify-between text-sm mt-4">
                  <Link
                    to={`/recipes/${recipe._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                  <div className="space-x-2">
                    <button
                      onClick={() => navigate(`/edit/${recipe._id}`)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
