import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => (
  <Link
    to={`/recipe/${recipe._id}`}
    className="block shadow-lg p-4 rounded bg-white hover:shadow-xl"
  >
    <img
      src={recipe.image}
      alt={recipe.title}
      className="w-full h-40 object-cover rounded"
    />
    <h2 className="mt-2 text-xl font-semibold">{recipe.title}</h2>
    <p className="text-sm text-gray-500">{recipe.cuisine}</p>
  </Link>
);
export default RecipeCard;
