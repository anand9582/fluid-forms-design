import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextType {
  isAltTheme: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isAltTheme, setIsAltTheme] = useState(false);

  const toggleTheme = () => setIsAltTheme((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isAltTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
