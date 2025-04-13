import Recipe from "../models/Recipe.js";

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    res.status(500).json({ message: "Server error while fetching recipes" });
  }
};

// SEARCH by name, ingredient, cuisine
export const searchRecipes = async (req, res) => {
  const q = req.query.q;
  try {
    const recipes = await Recipe.find({
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

// GET recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.json(recipe);
  } catch (err) {
    res.status(404).json({ error: "Recipe not found" });
  }
};

// POST new recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, cuisine, image } = req.body;

    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      cuisine,
      image,
      user: req.user._id, // 👈 from the middleware, secure!
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: "Failed to create recipe" });
  }
};

// PUT (update recipe)
export const updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
};

// DELETE recipe
export const deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(400).json({ error: "Deletion failed" });
  }
};
