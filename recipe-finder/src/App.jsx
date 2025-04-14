import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import AddRecipe from "./pages/AddRecipe";
import RecipeDetails from "./pages/RecipeDetails"; // ⬅️ important
import EditRecipe from "./pages/EditRecipe";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />{" "}
        <Route path="/edit/:id" element={<EditRecipe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
