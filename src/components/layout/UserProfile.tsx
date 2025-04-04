import { Settings, User, LogOut, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "../../services";

export const UserProfile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const userData = authService.getUserData();
    if (userData) {
      setUserName(userData.name);
      setTheme(userData.settings?.theme || "light");

      // Apply initial theme
      if (userData.settings?.theme === "dark") {
        document.body.classList.add("dark-theme");
      }
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Update user settings in localStorage
    const userData = authService.getUserData();
    if (userData) {
      userData.settings = {
        ...userData.settings,
        theme: newTheme,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      // Apply theme to body
      document.body.classList.toggle("dark-theme");
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={20} />
          </div>
          <span className="font-medium">{userName || "Guest"}</span>
        </div>
        <button
          className="p-2 bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100  hover:bg-gray-100 rounded-lg button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Settings Dropdown */}
      {showDropdown && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 dropdown">
          <div className="p-2 space-y-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 button"
            >
              {theme === "light" ? (
                <>
                  <Moon size={18} />
                  <span>Dark Theme</span>
                </>
              ) : (
                <>
                  <Sun size={18} />
                  <span>Light Theme</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-1"></div>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 text-red-600 button"
            >
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
