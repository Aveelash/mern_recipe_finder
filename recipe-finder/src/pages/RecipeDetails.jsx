import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:5000/api/recipes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecipe(data);
        setLoading(false); // Set loading to false after fetching data
      } catch (err) {
        console.error("❌ Error fetching recipe:", err);
        setError("Failed to fetch the recipe. Please try again later.");
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading recipe...</p>;

  if (error)
    return <p className="text-center mt-10 text-lg text-red-600">❌ {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2] p-6 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white/60 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden animate-fade-in-up">
        <img
          src={recipe.image || "https://via.placeholder.com/600x400"}
          alt={recipe.title}
          className="w-full h-80 object-cover"
        />

        <div className="p-8 space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">{recipe.title}</h1>
            <p className="text-indigo-500 text-lg italic mt-1">
              {recipe.cuisine}
            </p>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              🧂 Ingredients
            </h2>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((item, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              📖 Instructions
            </h2>
            <div className="bg-white p-4 rounded-xl shadow-inner text-gray-800 whitespace-pre-line leading-relaxed">
              {recipe.instructions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
