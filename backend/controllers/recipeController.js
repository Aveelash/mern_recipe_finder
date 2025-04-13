import Recipe from "../models/Recipe.js";

// GET all recipes (for the logged-in user)
export const getAllRecipes = async (req, res) => {
  try {
    const user = req.user; // Get the logged-in user from the middleware
    const recipes = await Recipe.find({ user: user._id }); // Filter by user ID
    res.status(200).json(recipes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch recipes", error: err.message });
  }
};

// SEARCH by name, ingredient, cuisine (for the logged-in user)
export const searchRecipes = async (req, res) => {
  const q = req.query.q;
  try {
    const user = req.user; // Get the logged-in user
    const recipes = await Recipe.find({
      user: user._id, // Filter by user ID to only search their own recipes
      $or: [
        { title: { $regex: q, $options: "i" } },
        { cuisine: { $regex: q, $options: "i" } },
        { ingredients: { $elemMatch: { $regex: q, $options: "i" } } },
      ],
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
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
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only update your own recipes" });
    }

    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
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
