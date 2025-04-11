import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [String],
  instructions: { type: String, required: true },
  cuisine: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Recipe", recipeSchema);
