import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    getUser();

    const handleStorageChange = () => getUser();
    window.addEventListener("userChanged", handleStorageChange);

    return () => {
      window.removeEventListener("userChanged", handleStorageChange);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0).toUpperCase();
    const second = parts[1]?.charAt(0).toUpperCase() || "";
    return first + second;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white">
      <Link to="/" className="text-xl font-bold">
        🍲 Recipe Finder
      </Link>

      {user ? (
        <div className="flex items-center space-x-4">
          {/* AddRecipe Link (available to all users) */}
          <Link to="/add" className="text-blue-500 font-medium hover:underline">
            Add Recipe
          </Link>

          {/* User initials */}
          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold text-lg">
            {getInitials(user.name)}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-3">
          <Link
            to="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-blue-500 font-medium hover:underline"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
