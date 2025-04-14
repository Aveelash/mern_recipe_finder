import express from "express";
import protect from "../middleware/authMiddleware.js"; // no adminOnly

import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/", protect, getAllRecipes);
router.post("/", protect, createRecipe);
router.get("/:id", protect, getRecipeById);
router.put("/:recipeId", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

export default router;
