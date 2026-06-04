import { LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-lg font-bold text-zinc-950 dark:text-white">TaskFlow</p>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{user?.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="icon-button" type="button" onClick={toggleTheme} title="Toggle dark mode">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="btn-secondary px-3" type="button" onClick={logout}>
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
