import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRecipe = () => {
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    cuisine: "",
    image: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("You must be logged in to add a recipe.");
      return;
    }

    const recipe = {
      ...form,
      ingredients: form.ingredients.split(","),
      user: user._id, // optional: for extra validation in controller
    };

    try {
      await axios.post("/api/recipes", recipe, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      navigate("/");
    } catch (err) {
      console.error("Error adding recipe:", err);
      alert("Failed to add recipe");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
      <input
        type="text"
        placeholder="Title"
        required
        className="w-full p-2 border"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Cuisine"
        required
        className="w-full p-2 border"
        onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
      />
      <input
        type="text"
        placeholder="Image URL"
        className="w-full p-2 border"
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
      <textarea
        placeholder="Ingredients (comma-separated)"
        required
        className="w-full p-2 border"
        onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
      />
      <textarea
        placeholder="Instructions"
        required
        className="w-full p-2 border"
        onChange={(e) => setForm({ ...form, instructions: e.target.value })}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Recipe
      </button>
    </form>
  );
};
export default AddRecipe;
