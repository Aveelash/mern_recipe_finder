import Recipe from "../models/Recipe.js";

export const getAllRecipes = async (req, res) => {
  const { q } = req.query;

  try {
    const userId = req.user._id; // 👤 Get the logged-in user

    const searchQuery = {
      user: userId, // 🔒 Show only recipes created by this user
    };

    if (q) {
      const searchRegex = new RegExp(q, "i");
      searchQuery.$or = [
        { title: searchRegex },
        { cuisine: searchRegex },
        { ingredients: { $elemMatch: { $regex: searchRegex } } },
      ];
    }

    const recipes = await Recipe.find(searchQuery);
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
};

// GET recipe by ID (ensure it's the logged-in user's recipe)
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only access your own recipes" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(404).json({ error: "Recipe not found" });
  }
};

// POST new recipe (with user data)
export const createRecipe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🔍 Log the incoming data
    console.log("📦 Received recipe data:", req.body);
    console.log("👤 Authenticated User:", req.user);

    const { title, description, ingredients, instructions, cuisine, image } =
      req.body;

    if (!title || !ingredients || !instructions || !cuisine) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Clean up ingredients
    const cleanedIngredients = Array.isArray(ingredients)
      ? ingredients.map((ingredient) => ingredient.trim())
      : ingredients.split(",").map((ingredient) => ingredient.trim());

    if (cleanedIngredients.length === 0) {
      return res.status(400).json({ error: "Ingredients cannot be empty" });
    }

    const recipe = new Recipe({
      title,
      description,
      ingredients: cleanedIngredients,
      instructions,
      cuisine,
      image,
      user: req.user._id, // Ensure that user._id exists
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    console.error("❌ Error creating recipe:", err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

// PUT (update recipe) - Ensure it belongs to the logged-in user
export const updateRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    recipe.title = req.body.title || recipe.title;
    recipe.description = req.body.description || recipe.description;
    recipe.ingredients = req.body.ingredients || recipe.ingredients;
    recipe.instructions = req.body.instructions || recipe.instructions;
    recipe.cuisine = req.body.cuisine || recipe.cuisine;
    recipe.image = req.body.image || recipe.image;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE recipe - Ensure it belongs to the logged-in user
export const deleteRecipe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own recipes" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(400).json({ error: "Deletion failed" });
  }
};
