import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        const { data } = await axios.get(`/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTitle(data.title);
        setCuisine(data.cuisine);
        setIngredients(data.ingredients.join(", "));
        setInstructions(data.instructions);
        setImage(data.image);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching recipe:", err);
        navigate("/");
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    try {
      await axios.put(
        `/api/recipes/${id}`,
        {
          title,
          cuisine,
          ingredients: ingredients.split(",").map((item) => item.trim()),
          instructions,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } catch (error) {
      console.error("❌ Failed to update recipe:", error);
      alert("Update failed. Please check the form.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading recipe...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e4ecf7] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
          ✏️ Edit Recipe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-gray-700 font-medium">Title</label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Cuisine */}
          <div>
            <label className="text-gray-700 font-medium">Cuisine</label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              required
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-gray-700 font-medium">
              Ingredients (comma-separated)
            </label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="text-gray-700 font-medium">Instructions</label>
            <textarea
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none min-h-[120px]"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-gray-700 font-medium">Image URL</label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-xl hover:bg-blue-600 transition duration-200"
            >
              ✅ Update Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
