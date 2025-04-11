import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    cuisine: "",
    image: "",
  });

  useEffect(() => {
    axios.get(`/api/recipes/${id}`).then((res) => {
      const { title, ingredients, instructions, cuisine, image } = res.data;
      setForm({
        title,
        ingredients: ingredients.join(", "),
        instructions,
        cuisine,
        image,
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedRecipe = {
      ...form,
      ingredients: form.ingredients.split(",").map((i) => i.trim()),
    };
    await axios.put(`/api/recipes/${id}`, updatedRecipe);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center">✏️ Edit Recipe</h2>
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        required
        className="w-full p-2 border rounded"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Cuisine"
        value={form.cuisine}
        required
        className="w-full p-2 border rounded"
        onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={form.image}
        className="w-full p-2 border rounded"
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
      <textarea
        placeholder="Ingredients (comma-separated)"
        value={form.ingredients}
        required
        className="w-full p-2 border rounded"
        onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
      />
      <textarea
        placeholder="Instructions"
        value={form.instructions}
        required
        className="w-full p-2 border rounded"
        onChange={(e) => setForm({ ...form, instructions: e.target.value })}
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Update Recipe
      </button>
    </form>
  );
};

export default EditRecipe;
